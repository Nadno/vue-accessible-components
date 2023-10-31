<script lang="ts" setup>
import { useId, useDescriptionFor } from '@/composables';

export type AriaDescriptionProps = {
  is?: any;
  id?: string;
  htmlFor: string | string[];
};

const props = defineProps<AriaDescriptionProps>();

const htmlFor = Array.isArray(props.htmlFor)
  ? props.htmlFor.join(' ')
  : props.htmlFor;

const id = useId(props.id);

useDescriptionFor(htmlFor, id);
</script>

<template>
  <component :is="is || 'span'" :id="id" :data-for="htmlFor">
    <slot />
  </component>
</template>
