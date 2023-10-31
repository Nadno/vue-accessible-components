<script lang="ts" setup>
import AriaDescription, { AriaDescriptionProps } from '../AriaDescription.vue';

export type RadioGroupLabelProps = AriaDescriptionProps;

defineProps<RadioGroupLabelProps>();
</script>

<template>
  <aria-description v-bind="$props"><slot /></aria-description>
</template>
