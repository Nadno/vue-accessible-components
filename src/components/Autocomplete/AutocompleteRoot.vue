<script lang="ts">
export const AUTOCOMPLETE_PROVIDER_NAME = 'autocomplete-provider';

export const AUTOCOMPLETE_PREVENT_OVERFLOW_PADDING = 32;
</script>

<script setup lang="ts">
import { Ref, provide, reactive } from 'vue';

import { RefSetter } from '@/components/utils';

import { preventOverflowWithMaxHeight } from '@/utils/popperPreventOverflowWithMaxHeight';

import {
  usePopover,
  PopoverData,
  PopoverActions,
  PopoverState,
} from '@/composables';

export type AutocompleteRootProps<TValue> = {
  id?: string;
  getOptionId?: (option: TValue, index: number) => string;
  getOptionValue?: (option: TValue, index: number) => string;
};

export type AutocompleteState<TValue> = {
  search: string;
  _typedSearch: string;
  deferredSearch: string;
  isChoosing: boolean;
  hasInlineSuggestion?: boolean;
  canSuggest?: boolean;
  options: TValue[];
  filteredOptions: TValue[];
  activeIndex: number;
};

export type AutocompleteProvider = PopoverData<PopoverState> &
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
      modifiers: [
        preventOverflowWithMaxHeight(AUTOCOMPLETE_PREVENT_OVERFLOW_PADDING),
      ],
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
  isChoosing: false,
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
  autocomplete.isChoosing = true;
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
