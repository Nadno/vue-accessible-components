<script lang="ts">
export const TAB_PROVIDER_NAME = 'tab-provider';
</script>

<script lang="ts" setup>
import { provide, reactive } from 'vue';

import { useId } from '@/composables/useId';

export type TabOrientations = 'horizontal' | 'vertical';

export type TabState = {
  titleId?: string;
  selectedName?: string;
  orientation: TabOrientations;
  detachOnCollapse: boolean;
};

export type TabProvider = {
  id: string;
  state: TabState;
};

export type TabRootProps = {
  id?: string;
};

const props = defineProps<TabRootProps>();

const tabId = useId(props.id);

const state = reactive<TabState>({
  selectedName: undefined,
  orientation: 'horizontal',
  detachOnCollapse: false,
});

provide(TAB_PROVIDER_NAME, {
  id: tabId,
  state,
});
</script>

<template>
  <slot />
</template>
