<script lang="ts" setup>
import AriaLabel, { AriaLabelProps } from '../AriaLabel.vue';

export type ToggleButtonGroupLabelProps = AriaLabelProps;

defineProps<ToggleButtonGroupLabelProps>();
</script>

<template>
  <aria-label v-bind="$props"><slot /></aria-label>
</template>
