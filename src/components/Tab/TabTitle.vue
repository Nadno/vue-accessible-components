<script lang="ts" setup>
import { onBeforeMount, watch } from 'vue';

import { useId } from '@/composables/useId';

import { useTabProvider } from './useTabProvider';

export type TabTitleProps = {
  is?: any;
  id?: string;
};

const props = defineProps<TabTitleProps>();

const { state } = useTabProvider();

const id = useId(props.id);

const updateTabStateTitleId = () => (state.titleId = props.id || id);

onBeforeMount(updateTabStateTitleId);
watch(() => props.id || id, updateTabStateTitleId);
</script>

<template>
  <component :is="is || 'span'" :id="state.titleId">
    <slot />
  </component>
</template>
