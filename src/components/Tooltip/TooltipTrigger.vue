<script setup lang="ts">
import { useTooltipProvider } from '.';
import { useMergedAriaAttributes } from '@/composables/useMergedAriaAttributes';

import { debounce } from 'lodash';
import { useInteractOutside } from '@/composables';
import { useHoverElement } from '@/composables/useHoverElement';

export type TooltipTriggerProps = {
  is?: any;
  label?: string;
};

withDefaults(defineProps<TooltipTriggerProps>(), {
  is: 'button',
});

defineOptions({
  inheritAttrs: false,
});

const {
  id,
  state,
  open,
  close,
  asLabel,
  tooltipTriggerRef,
  setTooltipTriggerRef,
} = useTooltipProvider('TooltipTrigger');

const ariaLabelAttribute = asLabel ? 'aria-labelledby' : 'aria-describedby';
const ariaAttributes = useMergedAriaAttributes({
  [ariaLabelAttribute]: id,
});

useInteractOutside(
  () => state.open,
  tooltipTriggerRef,
  () => {
    if (!state.open) return;
    close();
  },
);

useHoverElement(tooltipTriggerRef, {
  onHoverIn: open,
  onHoverOut: close,
});

const handleOpen = debounce(open, 300);
</script>

<template>
  <component
    v-bind="{ ...$props, ...$attrs, ...ariaAttributes }"
    :is="is"
    :aria-label="label"
    @focus="handleOpen"
    @blur="close"
    @vue:mounted="setTooltipTriggerRef"
  >
    <slot />
  </component>
</template>
