<script lang="ts">
export const TOOLTIP_PROVIDER_NAME = 'tooltip-provider';
</script>

<script setup lang="ts">
import { Ref, provide } from 'vue';

import {
  usePopover,
  PopoverState,
  PopoverData,
  PopoverActions,
} from '@/composables';

import { RefSetter } from '../utils';

export type TooltipState = PopoverState;

export type TooltipProvider = PopoverData &
  PopoverActions & {
    asLabel: boolean,
    setTooltipContainerRef: RefSetter;
    tooltipContainerRef: Ref<HTMLElement | null>;
    setTooltipContentRef: RefSetter;
    tooltipContentRef: Ref<HTMLElement | null>;
    setTooltipTriggerRef: RefSetter;
    tooltipTriggerRef: Ref<HTMLElement | null>;
  };

export type TooltipRootProps = {
  id?: string;
  asLabel?: boolean,
};

defineOptions({
  name: 'TooltipRoot',
});

const props = defineProps<TooltipRootProps>();
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
});

provide(TOOLTIP_PROVIDER_NAME, {
  ...popover,
  asLabel: !!props.asLabel,
  tooltipContainerRef: popoverContainerRef,
  tooltipContentRef: popoverContentRef,
  tooltipTriggerRef: popoverTriggerRef,
  setTooltipContainerRef: setPopoverContainerRef,
  setTooltipContentRef: setPopoverContentRef,
  setTooltipTriggerRef: setPopoverTriggerRef,
});
</script>

<template>
  <slot />
</template>
