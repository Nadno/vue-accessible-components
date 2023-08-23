<script setup lang="ts">
import { useDialogProvider } from './useDialogProvider';

export type DialogTriggerProps = {
  is?: any;
};

defineProps<DialogTriggerProps>();

const { ids, state, toggle, setTriggerRef } =
  useDialogProvider('DialogTrigger');
</script>

<template>
  <component
    :ref="setTriggerRef"
    :is="is || 'button'"
    :data-state="state.open ? 'open' : 'closed'"
    :aria-controls="ids.content"
    :aria-expanded="state.open ? 'true' : 'false'"
    aria-haspopup="dialog"
    @click="toggle"
  >
    <slot />
  </component>
</template>
