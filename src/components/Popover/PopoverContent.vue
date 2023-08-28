<script setup lang="ts">
import { usePopoverProvider } from './usePopoverProvider';

import type { PopoverContentSides, PopoverContentAligns } from '@/composables';

export type { PopoverContentSides, PopoverContentAligns } from '@/composables';

export type PopoverContentProps = {
  offset?: [number, number];
  side: PopoverContentSides;
  align: PopoverContentAligns;
  label?: string;
  containerClass?: string | object;
};

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<PopoverContentProps>(), {
  offset: () => [0, 0],
  side: 'bottom',
  align: 'center',
});

const { id, state, setOptions, setPopoverContainerRef, setPopoverContentRef } =
  usePopoverProvider('PopoverContent');

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
    :ref="setPopoverContainerRef"
    :data-side="side"
    :data-align="align"
    data-state="closed"
  >
    <div
      v-bind="$attrs"
      :id="id"
      :ref="setPopoverContentRef"
      :aria-label="label"
      :data-side="side"
      :data-align="align"
      data-state="closed"
    >
      <slot />
    </div>
  </div>
</template>
