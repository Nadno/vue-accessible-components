<script setup lang="ts">
import { useProgressbarProvider } from './useProgressbarProvider';
const { min, max, percentage, progressState } = useProgressbarProvider();
</script>

<template>
  <div
    :data-state="progressState"
    :data-min="min"
    :data-max="max"
    :data-value="percentage"
  >
    <slot />
  </div>
</template>
