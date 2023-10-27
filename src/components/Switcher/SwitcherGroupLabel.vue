<script lang="ts" setup>
import AriaLabel, { AriaLabelProps } from '../AriaLabel.vue';

export type SwitchGroupLabelProps = AriaLabelProps;

defineProps<SwitchGroupLabelProps>();
</script>

<template>
  <aria-label v-bind="$props"><slot /></aria-label>
</template>
