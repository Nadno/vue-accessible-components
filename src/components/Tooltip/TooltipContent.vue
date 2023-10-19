<script setup lang="ts">
import { useTooltipProvider } from './useTooltipProvider';

import type {
  PopoverContentSides as TooltipContentSides,
  PopoverContentAligns as TooltipContentAligns,
} from '@/composables';

export type { TooltipContentSides, TooltipContentAligns };

export type TooltipContentProps = {
  offset?: [number, number];
  side: TooltipContentSides;
  align: TooltipContentAligns;
  label?: string;
  containerClass?: string | object;
};

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<TooltipContentProps>(), {
  offset: () => [0, 0],
  side: 'bottom',
  align: 'center',
});

const { id, state, setOptions, setTooltipContainerRef, setTooltipContentRef } =
  useTooltipProvider('TooltipContent');

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
</script>

<template>
  <div
    v-show="state.open"
    :class="containerClass"
    :ref="setTooltipContainerRef"
    :data-side="side"
    :data-align="align"
    data-state="closed"
  >
    <div
      v-bind="$attrs"
      :id="id"
      :ref="setTooltipContentRef"
      :aria-label="label"
      :data-side="side"
      :data-align="align"
      role="tooltip"
      data-state="closed"
    >
      <slot />
    </div>
  </div>
</template>
