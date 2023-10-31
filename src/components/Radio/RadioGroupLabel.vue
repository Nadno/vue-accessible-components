<script lang="ts" setup>
import AriaLabel, { AriaLabelProps } from '../AriaLabel.vue';

export type RadioGroupLabelProps = AriaLabelProps;

defineProps<RadioGroupLabelProps>();
</script>

<template>
  <aria-label v-bind="$props"><slot /></aria-label>
</template>
