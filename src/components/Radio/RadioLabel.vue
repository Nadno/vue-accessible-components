<script lang="ts" setup>
export type RadioLabelProps = {
  htmlFor: string;
};

defineProps<RadioLabelProps>();
</script>

<template>
  <label :for="htmlFor"><slot /></label>
</template>
