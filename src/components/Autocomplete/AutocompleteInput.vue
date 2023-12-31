<script lang="ts" setup>
import { InputHTMLAttributes, nextTick, watch } from 'vue';
import { debounce } from 'lodash';

import { useAutocompleteProvider } from './useAutocompleteProvider';
import { useInteractOutside, useNullableRef } from '@/composables';

import { isCompletelyVisibleOnVertical } from '@/utils/isCompletelyVisible';

export type AutocompleteInputProps<TValue> = {
  modelValue?: TValue;
  label?: string;
  search?: boolean;
  autocomplete?: boolean;
  inline?: boolean;
  showAutocompleteOnFocus?: boolean;
};

export type AutocompleteInputEmits<TValue> = {
  (e: 'update:modelValue', value?: TValue): void;
  (e: 'onInlineSuggest', option: TValue): void;
  (e: 'onComplete', option?: TValue): void;
};

const props = withDefaults(defineProps<AutocompleteInputProps<unknown>>(), {
  showAutocompleteOnFocus: true,
  autocomplete: true,
  inline: true,
});

const emits = defineEmits<AutocompleteInputEmits<any>>();

const {
  type,
  id,
  triggerId,
  state,
  autocomplete,
  open,
  close,
  getOptions,
  getOption,
  getActiveOptionValue,
  autocompleteInputRef,
  autocompleteListRef,
  autocompleteContainerRef,
  setAutocompleteInputRef,
} = useAutocompleteProvider('AutocompleteInput');

const withAutocompleteInput =
    useNullableRef<HTMLInputElement>(autocompleteInputRef),
  withAutocompleteList = useNullableRef<HTMLElement>(autocompleteListRef);

const getAutocompleteType = (): InputHTMLAttributes['aria-autocomplete'] => {
  if (props.autocomplete && props.autocomplete) return 'both';
  if (props.autocomplete) return 'list';
  if (props.inline) return 'inline';
  return 'none';
};

const autocompleteType = getAutocompleteType(),
  inputType = props.search ? 'search' : 'text';

const showInlineSuggestion = () => {
  withAutocompleteInput(($input) => {
    if (!autocomplete.hasInlineSuggestion) {
      return;
    }

    emits('onInlineSuggest', getOption(0));

    nextTick(() => {
      requestAnimationFrame(() => {
        $input.setSelectionRange(
          autocomplete._typedSearch.length,
          autocomplete.search.length,
        );
      });
    });
  });
};

watch(() => autocomplete.hasInlineSuggestion, showInlineSuggestion, {
  flush: 'post',
});

const getCurrentFocusedOption = ($input: HTMLElement): HTMLElement | null => {
  const currentSelected = $input.getAttribute('aria-activedescendant');
  if (!currentSelected) return null;
  const $option = document.getElementById(currentSelected);
  if ($option && !$option.matches('[data-focused]')) return null;
  return $option;
};

const removeFocusedOptionOnClose = () => {
  if (state.open) return;
  withAutocompleteInput(($input) => {
    const $current = getCurrentFocusedOption($input);
    if ($current) {
      delete $current.dataset.focused;
      delete $current.dataset.active;
    }

    $input.removeAttribute('aria-activedescendant');
    autocomplete.activeIndex = -1;
  });
};

watch(() => state.open, removeFocusedOptionOnClose);

const handleFocusInput = () => {
  if (!props.showAutocompleteOnFocus) return;
  open();
};

const handleClickOutsideInput = (e: MouseEvent | FocusEvent) => {
  const $target = (
    e.type === 'pointerdown' ? e.target : e.relatedTarget
  ) as HTMLElement | null;

  withAutocompleteList(($list) => {
    if ($list.contains($target)) return;

    if (autocomplete.isChoosing) {
      withAutocompleteInput(($input) =>
        $input.setSelectionRange($input.selectionEnd, $input.selectionEnd),
      );

      autocomplete.isChoosing = false;
      autocomplete.deferredSearch = getActiveOptionValue();
    }

    close();
  });
};

useInteractOutside(
  () => state.open,
  autocompleteInputRef,
  handleClickOutsideInput,
);

const handleEscapeAutocomplete = () => {
  if (!state.open) return;

  if (autocomplete.isChoosing) {
    autocomplete.isChoosing = false;
  } else if (autocomplete.hasInlineSuggestion) {
    autocomplete.hasInlineSuggestion = false;
  }

  if (autocomplete.isChoosing || autocomplete.hasInlineSuggestion) {
    autocomplete.search = autocomplete._typedSearch;
    autocomplete._typedSearch = '';
  }

  close();
};

const focusOption = ($input: HTMLInputElement, $option: HTMLElement) => {
  $option.dataset.focused = 'true';
  $option.dataset.active = 'true';
  $input.setAttribute('aria-activedescendant', $option.id);

  requestAnimationFrame(() => {
    if (!autocompleteContainerRef.value) return;
    if (isCompletelyVisibleOnVertical(autocompleteContainerRef.value, $option))
      return;

    $option.scrollIntoView({
      block: 'nearest',
      inline: 'center',
    });
  });
};

const focusSiblingOption = (
  $input: HTMLInputElement,
  $current: HTMLElement,
  direction: 'prev' | 'next',
) => {
  const nextElementKey =
    direction === 'next' ? 'nextElementSibling' : 'previousElementSibling';

  const $next = $current[nextElementKey] as HTMLElement;
  if (!$next) return;

  delete $current.dataset.focused;
  delete $current.dataset.active;
  focusOption($input, $next);
};

const focusOptionAt = (at: 'begin' | 'end', $input: HTMLInputElement) => {
  withAutocompleteList(($autocomplete) => {
    const $current = (
      at === 'begin'
        ? $autocomplete.firstElementChild
        : $autocomplete.lastElementChild
    ) as HTMLElement;

    if ($current) focusOption($input, $current);
  }, null);
};

const handleFocusNextOption = (e: Event) => {
  if (!state.open) return;

  e.preventDefault();

  withAutocompleteInput(($input) => {
    nextTick(() => requestAnimationFrame(() => $input.select()));

    const $current = getCurrentFocusedOption($input);
    if (!$current) {
      autocomplete.activeIndex = 0;
      focusOptionAt('begin', $input);

      autocomplete._typedSearch = autocomplete.search;
      autocomplete.search = getActiveOptionValue();
      autocomplete.isChoosing = true;

      return;
    }

    if ($current.matches(':last-of-type')) return;

    focusSiblingOption($input, $current, 'next');
    autocomplete.activeIndex++;
    autocomplete.search = getActiveOptionValue();
  });
};

const handleFocusPreviousOption = (e: Event) => {
  if (!state.open) return;

  e.preventDefault();

  withAutocompleteInput(($input) => {
    nextTick(() => requestAnimationFrame(() => $input.select()));

    const $current = getCurrentFocusedOption($input);
    if (!$current) {
      autocomplete.activeIndex = getOptions().length - 1;
      focusOptionAt('end', $input);

      autocomplete._typedSearch = autocomplete.search;
      autocomplete.search = getActiveOptionValue();
      autocomplete.isChoosing = true;

      return;
    }

    if ($current.matches(':first-of-type')) return;

    focusSiblingOption($input, $current, 'prev');
    autocomplete.activeIndex--;
    autocomplete.search = getActiveOptionValue();
  });
};

const defer = debounce((callback: Function) => {
  callback();
}, 400);

const handleInputValue = (e: InputEvent) => {
  const $target = e.target as HTMLInputElement;
  if (!$target) return;

  const value = $target.value;

  autocomplete.search = value;

  defer(() => {
    if (!!value && !state.open) open();
    autocomplete.deferredSearch = value;

    const inputType = e.inputType;
    autocomplete.canSuggest =
      !inputType.startsWith('delete') && !inputType.startsWith('history');
  });
};

const handleSelectOption = (e: Event) => {
  if (!state.open || !autocomplete.isChoosing) return;

  e.preventDefault();

  const { activeIndex: currentIndex } = autocomplete;
  if (currentIndex < 0) return;

  const option = getOption(currentIndex);

  autocomplete.search = getActiveOptionValue();
  autocomplete.deferredSearch = getActiveOptionValue();

  emits('update:modelValue', option);
  emits('onComplete', option);

  close();

  withAutocompleteInput(($input) =>
    $input.setSelectionRange($input.selectionEnd, $input.selectionEnd),
  );
};
</script>

<template>
  <input
    :value="autocomplete.search"
    :ref="setAutocompleteInputRef"
    :type="inputType"
    :id="triggerId"
    :aria-owns="id"
    :aria-controls="id"
    :aria-expanded="state.open"
    :aria-haspopup="type"
    :aria-label="label"
    :aria-autocomplete="autocompleteType"
    :data-state="state.open ? 'open' : 'closed'"
    :data-choosing="autocomplete.isChoosing || undefined"
    autocomplete="off"
    @focus="handleFocusInput"
    @keydown.tab.exact="handleSelectOption"
    @keydown.enter.capture="handleSelectOption"
    @keydown.escape="handleEscapeAutocomplete"
    @keydown.alt.down="open"
    @keydown.up.exact="handleFocusPreviousOption"
    @keydown.down.exact="handleFocusNextOption"
    @input.trim="handleInputValue($event as InputEvent)"
  />
</template>
