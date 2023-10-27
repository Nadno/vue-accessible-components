<script lang="ts" setup>
export type SwitchLabelProps = {
  htmlFor: string;
};

defineProps<SwitchLabelProps>();
</script>

<template>
  <label :for="htmlFor"><slot /></label>
</template>
