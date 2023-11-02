<script lang="ts">
export const AUTOCOMPLETE_PROVIDER_NAME = 'autocomplete-provider';
</script>

<script setup lang="ts">
import { Ref, provide, reactive } from 'vue';

import { RefSetter } from '@/components/utils';

import {
  usePopover,
  PopoverData,
  PopoverActions,
  PopoverState,
} from '@/composables';

import { Modifier, detectOverflow } from '@popperjs/core';

export type AutocompleteRootProps<TValue> = {
  id?: string;
  getOptionId?: (option: TValue, index: number) => string;
  getOptionValue?: (option: TValue, index: number) => string;
};

export type AutocompleteState<Tvalue> = {
  search: string;
  _typedSearch: string;
  deferredSearch: string;
  isChooshing: boolean;
  hasInlineSuggestion?: boolean;
  canSuggest?: boolean;
  options: Tvalue[];
  filteredOptions: Tvalue[];
  activeIndex: number;
};

export type AutocompleteProvider = PopoverData &
  PopoverActions & {
    suggest: (suggestionIndex: number) => void;
    getOptions: () => any[];
    getOption: (index: number) => any;
    getOptionId: (option: unknown, index: number) => string;
    getOptionValue: (option: unknown, index: number) => string;
    getActiveOptionValue: () => string;
    clearFilter: () => void;
    state: PopoverState;
    autocomplete: AutocompleteState<any>;
    setAutocompleteContainerRef: RefSetter;
    autocompleteContainerRef: Ref<HTMLElement | null>;
    setAutocompleteListRef: RefSetter;
    autocompleteListRef: Ref<HTMLElement | null>;
    setAutocompleteInputRef: RefSetter;
    autocompleteInputRef: Ref<HTMLElement | null>;
  };

defineOptions({
  name: 'AutocompleteRoot',
});

const props = defineProps<AutocompleteRootProps<any>>();

const preventOverflowWithMaxHeight = (
  padding: number,
): Modifier<'preventOverflowWithMaxHeight', {}> => {
  return {
    enabled: true,
    name: 'preventOverflowWithMaxHeight',
    phase: 'main',
    fn: ({ state }) => {
      const { placement, styles, elements } = state,
        overflow = detectOverflow(state);

      const isTop = placement.startsWith('top') && overflow.top > 0,
        isBottom =
          !isTop && placement.startsWith('bottom') && overflow.bottom > 0;

      if (!isTop && !isBottom) return;

      const popperHeight = elements.popper.getBoundingClientRect().height,
        maxHeight =
          (isTop
            ? popperHeight - overflow.top
            : popperHeight - overflow.bottom) - padding;

      if (maxHeight < 0) return;
      return {
        ...state,
        styles: {
          ...styles,
          popper: {
            ...styles.popper,
            maxHeight: `${maxHeight}px`,
          },
        },
      };
    },
  };
};

const getOptionId =
    props.getOptionId || ((_: any, index: number) => `option[${index}]`),
  getOptionValue = props.getOptionValue || ((value: any) => String(value));

const {
  popoverContainerRef,
  popoverContentRef,
  popoverTriggerRef,
  setPopoverContainerRef,
  setPopoverContentRef,
  setPopoverTriggerRef,
  ...popover
} = usePopover({
  id: props.id,
  type: 'listbox',
  state: {
    options: {
      modifiers: [preventOverflowWithMaxHeight(32)],
    },
  },
});

const autocomplete = reactive<AutocompleteState<any>>({
  search: '',
  _typedSearch: '',
  deferredSearch: '',
  options: [],
  filteredOptions: [],
  activeIndex: -1,
  isChooshing: false,
});

const getOptions = (): any[] => {
  const { options, filteredOptions } = autocomplete;
  const isFiltered = !!filteredOptions.length;
  return isFiltered ? filteredOptions : options;
};

const getOption = (index: number): any => getOptions()[index];

const getActiveOptionValue = (): string => {
  return getOptionValue(
    getOption(autocomplete.activeIndex),
    autocomplete.activeIndex,
  );
};

const suggest = (suggestionIndex: number) => {
  autocomplete.activeIndex = suggestionIndex;
  autocomplete.isChooshing = true;
  autocomplete._typedSearch = autocomplete.search;
  autocomplete.search = getActiveOptionValue();
  autocomplete.hasInlineSuggestion = true;
};

const clearFilter = () => {
  autocomplete.deferredSearch = '';
};

provide(AUTOCOMPLETE_PROVIDER_NAME, {
  ...popover,
  autocomplete,
  suggest,
  getOptions,
  getOption,
  getOptionId,
  getOptionValue,
  getActiveOptionValue,
  clearFilter,
  autocompleteContainerRef: popoverContainerRef,
  autocompleteListRef: popoverContentRef,
  autocompleteInputRef: popoverTriggerRef,
  setAutocompleteContainerRef: setPopoverContainerRef,
  setAutocompleteListRef: setPopoverContentRef,
  setAutocompleteInputRef: setPopoverTriggerRef,
});
</script>

<template>
  <slot />
</template>
