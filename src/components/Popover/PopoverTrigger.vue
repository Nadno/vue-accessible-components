<script setup lang="ts">
import { usePopoverProvider } from './usePopoverProvider';

export type PopoverTrigger = {
  is?: any;
  label?: string;
};

withDefaults(defineProps<PopoverTrigger>(), {
  is: 'button',
});

const { type, id, triggerId, state, toggle, setPopoverTriggerRef } =
  usePopoverProvider('PopoverTrigger');
</script>

<template>
  <component
    :ref="setPopoverTriggerRef"
    :is="is"
    :id="triggerId"
    :data-state="state.open ? 'open' : 'closed'"
    :aria-controls="id"
    :aria-expanded="state.open"
    :aria-haspopup="type"
    :aria-label="label"
    @click.capture="toggle"
  >
    <slot />
  </component>
</template>
