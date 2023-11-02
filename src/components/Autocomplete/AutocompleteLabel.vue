<script lang="ts" setup>
import AriaLabel, { AriaLabelProps } from '../AriaLabel.vue';

export type AutocompleteLabelProps = AriaLabelProps;

defineProps<AutocompleteLabelProps>();
</script>

<template>
  <aria-label v-bind="$props"><slot /></aria-label>
</template>
