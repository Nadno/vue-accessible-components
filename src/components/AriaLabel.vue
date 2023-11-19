<script lang="ts" setup>
import { useId, useLabelFor } from '@/composables';

export type AriaLabelProps = {
  is?: any;
  id?: string;
  htmlFor: string | string[];
};

const props = defineProps<AriaLabelProps>();

const htmlFor = Array.isArray(props.htmlFor)
  ? props.htmlFor.join(' ')
  : props.htmlFor;

const id = useId(props.id);

useLabelFor(props.htmlFor, id);
</script>

<template>
  <component :is="is || 'span'" :id="id" :data-for="htmlFor">
    <slot />
  </component>
</template>
