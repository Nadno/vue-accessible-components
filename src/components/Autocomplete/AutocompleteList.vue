<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useAutocompleteProvider } from './useAutocompleteProvider';

import {
  type PopoverContentSides,
  type PopoverContentAligns,
  useNullableRef,
} from '@/composables';

export type { PopoverContentSides, PopoverContentAligns } from '@/composables';

export type AutocompleteFilterData<TValue> = {
  search: string;
  option: TValue;
  index: number;
};

export type AutocompleteFilterHandler<TValue> = (
  data: AutocompleteFilterData<TValue>,
) => boolean;

export type AutocompleteListProps<TValue> = {
  offset?: [number, number];
  side?: PopoverContentSides;
  align?: PopoverContentAligns;
  label?: string;
  containerClass?: string | object | Array<string | object>;
  optionClass?: string | object | Array<string | object>;
  options: TValue[];
  getOptionId?: (option: TValue, index: number) => string;
  getOptionValue?: (option: TValue, index: number) => string;
  filterOptionList?: AutocompleteFilterHandler<TValue>;
  withNewOptionAt?: 'begin' | 'end';
};

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AutocompleteListProps<any>>(), {
  offset: () => [0, 0],
  side: 'bottom',
  align: 'center',
});

const {
  id,
  state,
  autocomplete,
  close,
  suggest,
  setOptions,
  getOptionId,
  getOptionValue,
  getActiveOptionValue,
  autocompleteInputRef,
  setAutocompleteContainerRef,
  setAutocompleteListRef,
} = useAutocompleteProvider('AutocompleteList');

setOptions({
  side: props.side,
  align: props.align,
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: props.offset,
      },
    },
  ],
});

const withAutocompleteInput = useNullableRef<HTMLInputElement>(
  autocompleteInputRef,
);

const customFilterOptionList = props.filterOptionList,
  hasCustomFilterOptionList = !!customFilterOptionList;

const defaultFilterOptionList: AutocompleteFilterHandler<any> = ({
  search,
  option,
  index,
}) => {
  const value = getOptionValue(option, index);
  return value.toLocaleLowerCase().startsWith(search.toLocaleLowerCase());
};

const filteredOptionList = computed(() => {
  autocomplete.filteredOptions = [];

  const search = autocomplete.deferredSearch;
  if (!search) return autocomplete.options;

  const filter = hasCustomFilterOptionList
    ? customFilterOptionList
    : defaultFilterOptionList;

  autocomplete.filteredOptions = autocomplete.options.filter((option, index) =>
    filter({
      option,
      search,
      index,
    }),
  );

  return autocomplete.filteredOptions;
});

const suggestFirstFilteredOption = () => {
  if (hasCustomFilterOptionList || !autocomplete.canSuggest) return;

  const option = filteredOptionList.value[0];
  if (!option || !autocomplete.search) return;

  suggest(0);
};

watch(filteredOptionList, suggestFirstFilteredOption);

onMounted(() => {
  autocomplete.options = props.options;
});

const handleSelectOption = (e: MouseEvent) => {
  const $target = e.target as HTMLElement | null;
  if (!$target || !$target.matches('[data-option]')) return;

  const index = parseInt($target.dataset.index ?? '0');
  if (!Number.isInteger(index)) {
    console.warn(
      'It was not possible to get the [data-index] from the option element.',
    );
    return;
  }

  autocomplete.activeIndex = index;
  autocomplete.search = getActiveOptionValue();
  autocomplete.deferredSearch = getActiveOptionValue();

  close();
};

const handleFocusByMouseOver = (e: MouseEvent) => {
  if (autocomplete.isChooshing) return;

  const $target = e.target as HTMLElement;

  if (!$target || !$target.matches('[data-option]')) return;
  $target.dataset.active = 'true';

  withAutocompleteInput(($input) =>
    $input.setAttribute('aria-activedescendant', $target.id),
  );
};

const handleFocusoutByMouseOut = (e: MouseEvent) => {
  if (autocomplete.isChooshing) return;

  const $target = e.target as HTMLElement;

  if (!$target || !$target.matches('[data-option]')) return;
  delete $target.dataset.active;

  withAutocompleteInput(($input) =>
    $input.removeAttribute('aria-activedescendant'),
  );
};
</script>

<template>
  <div
    v-show="state.open"
    :class="containerClass"
    :ref="setAutocompleteContainerRef"
    :data-side="side"
    :data-align="align"
    data-state="closed"
  >
    <ul
      v-bind="$attrs"
      role="listbox"
      :id="id"
      :ref="setAutocompleteListRef"
      :aria-label="label"
      :data-side="side"
      :data-align="align"
      :data-choosing="autocomplete.isChooshing || undefined"
      data-state="closed"
      tabindex="-1"
      @click="handleSelectOption"
      @mouseover="handleFocusByMouseOver"
      @mouseout="handleFocusoutByMouseOut"
    >
      <slot name="default" v-bind="autocomplete" :options="filteredOptionList">
        <li
          v-for="(option, index) in filteredOptionList"
          :key="getOptionId(option, index)"
          :id="getOptionId(option, index)"
          :class="optionClass"
          :data-index="index"
          role="option"
          data-option
        >
          <slot name="option" :option="option">
            {{ getOptionValue(option, index) }}
          </slot>
        </li>
      </slot>
    </ul>

    <div role="status">
      <slot
        name="status"
        v-bind="autocomplete"
        :options="filteredOptionList"
        :with-new-option-at="withNewOptionAt"
      ></slot>
    </div>
  </div>
</template>
