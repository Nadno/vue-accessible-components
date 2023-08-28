<script setup lang="ts">
import { usePopoverProvider } from './usePopoverProvider';

export type PopoverClose = {
  is?: any;
  label?: string;
};

withDefaults(defineProps<PopoverClose>(), {
  is: 'button',
});

const { close } = usePopoverProvider('PopoverClose');
</script>

<template>
  <component :is="is" :aria-label="label" @click="close">
    <slot />
  </component>
</template>
