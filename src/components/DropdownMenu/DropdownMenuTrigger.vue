<script setup lang="ts">
import { useDropdownMenuProvider } from './useDropdownMenuProvider';

export type DropdownMenuTrigger = {
  is?: any;
};

withDefaults(defineProps<DropdownMenuTrigger>(), {
  is: 'button',
});

const { id, triggerId, state, toggle, setDropdownMenuTriggerRef } =
  useDropdownMenuProvider('DropdownMenuTrigger');
</script>

<template>
  <component
    :ref="setDropdownMenuTriggerRef"
    :is="is"
    :id="triggerId"
    :data-state="state.open ? 'open' : 'closed'"
    :aria-controls="id"
    :aria-expanded="state.open"
    aria-haspopup="menu"
    @click.capture="toggle"
  >
    <slot />
  </component>
</template>
