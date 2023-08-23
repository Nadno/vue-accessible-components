<script setup lang="ts">
import { useDialogProvider } from './useDialogProvider';

export type DialogTriggerProps = {
  is?: any;
};

defineProps<DialogTriggerProps>();

const { close } = useDialogProvider('DialogClose');
</script>

<template>
  <component :is="is || 'button'" @click="close">
    <slot />
  </component>
</template>
