<script setup lang="ts">
import { usePopoverProvider } from './usePopoverProvider';
import { useMergedAriaAttributes } from '@/composables/useMergedAriaAttributes';

export type PopoverTrigger = {
  is?: any;
  label?: string;
};

withDefaults(defineProps<PopoverTrigger>(), {
  is: 'button',
});

const { type, id, triggerId, state, toggle, setPopoverTriggerRef } =
  usePopoverProvider('PopoverTrigger');

const ariaAttributes = useMergedAriaAttributes({
  'aria-controls': id,
});
</script>

<template>
  <component
    v-bind="{ ...$attrs, ...ariaAttributes }"
    :is="is"
    :id="triggerId"
    :data-state="state.open ? 'open' : 'closed'"
    :aria-expanded="state.open"
    :aria-haspopup="type"
    :aria-label="label"
    @click="toggle"
    @vue:mounted="setPopoverTriggerRef"
  >
    <slot />
  </component>
</template>
