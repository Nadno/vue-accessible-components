<script lang="ts">
export const DROPDOWN_MENU_PROVIDER_NAME = 'dropdown-menu-provider';
</script>

<script setup lang="ts">
import { provide, Ref } from 'vue';

import { RefSetter } from '@/components/utils';

import {
  usePopover,
  PopoverData,
  PopoverActions,
  PopoverState,
} from '@/composables';

export type DropdownMenuState = PopoverState;

export type DropdownMenuProvider = PopoverData &
  PopoverActions & {
    setDropdownMenuContainerRef: RefSetter;
    dropdownMenuContainerRef: Ref<HTMLElement | null>;
    setDropdownMenuContentRef: RefSetter;
    dropdownMenuContentRef: Ref<HTMLElement | null>;
    setDropdownMenuTriggerRef: RefSetter;
    dropdownMenuTriggerRef: Ref<HTMLElement | null>;
  };

defineOptions({
  name: 'DropdownMenuRoot',
});

const props = defineProps({
  id: {
    req: false,
    type: String,
  },
});

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
  type: 'menu',
});

provide(DROPDOWN_MENU_PROVIDER_NAME, {
  ...popover,
  dropdownMenuContainerRef: popoverContainerRef,
  dropdownMenuContentRef: popoverContentRef,
  dropdownMenuTriggerRef: popoverTriggerRef,
  setDropdownMenuContainerRef: setPopoverContainerRef,
  setDropdownMenuContentRef: setPopoverContentRef,
  setDropdownMenuTriggerRef: setPopoverTriggerRef,
});
</script>

<template>
  <slot />
</template>
