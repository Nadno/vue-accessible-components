<script lang="ts" setup>
import { onBeforeMount, watch } from 'vue';

import { useTabProvider } from './useTabProvider';

export type TabContentProps = {
  defaultSelected?: string;
  detachOnCollapse?: boolean;
};

const props = withDefaults(defineProps<TabContentProps>(), {
  defaultSelected: undefined,
  detachOnCollapse: undefined,
});

const { state } = useTabProvider('TabContent');

const setDefaultSelectedPanel = () => {
  if (!props.defaultSelected || state.selectedName) return;
  state.selectedName = props.defaultSelected;
};

onBeforeMount(setDefaultSelectedPanel);

const updateGlobalDetachOnCollapse = () => {
  if (props.detachOnCollapse == null) return;
  state.detachOnCollapse = props.detachOnCollapse;
};

onBeforeMount(updateGlobalDetachOnCollapse);
watch(() => props.detachOnCollapse, updateGlobalDetachOnCollapse);
</script>

<template>
  <div
    data-tab-content
    :data-orientation="state.orientation"
    :data-selected="state.selectedName"
  >
    <slot />
  </div>
</template>
