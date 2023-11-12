<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';

import { useToggleVisibility } from '@/composables';
import { useTabProvider } from './useTabProvider';

export type TabPanelProps = {
  name?: string;
  label?: string;
  selected?: boolean;
  preventFocus?: boolean;
  defaultSelected?: boolean;
  detachOnCollapse?: boolean;
};

const props = withDefaults(defineProps<TabPanelProps>(), {
  name: undefined,
  label: undefined,
  selected: undefined,
  preventFocus: undefined,
  defaultSelected: undefined,
  detachOnCollapse: undefined,
});

const tabPanel = ref<HTMLElement | null>(null);

const { id: tabId, state } = useTabProvider('TabPanel');

const isSelected = computed(() =>
  props.selected == null ? state.selectedName === props.name : props.selected,
);

const isAttached = computed(() => {
  const detachOnCollapse =
    props.detachOnCollapse == null
      ? state.detachOnCollapse
      : props.detachOnCollapse;

  return detachOnCollapse ? isSelected.value : true;
});

const tabItemId = `tab-item-[${tabId}]-[${props.name}]`;

useToggleVisibility(isSelected, (open) => {
  const $tabpanel = tabPanel.value;
  if (!$tabpanel) return;

  requestAnimationFrame(() => {
    $tabpanel.dataset.state = open ? 'selected' : 'collapsed';
  });

  const $tabitem = document.getElementById(tabItemId);
  if ($tabitem) {
    $tabitem.dataset.state = open ? 'selected' : 'collapsed';
  }
});

const handleDefaultSelected = () => {
  if (!props.defaultSelected || !props.name) return;
  state.selectedName = props.name;
};

onBeforeMount(handleDefaultSelected);
</script>

<template>
  <div
    v-if="isAttached"
    data-tab-panel
    data-state="collapsed"
    role="tabpanel"
    ref="tabPanel"
    :tabindex="preventFocus ? -1 : 0"
    :aria-label="label"
    :aria-labelledby="label ? undefined : tabItemId"
    :data-name="name"
    :data-selected="isSelected || undefined"
    :data-orientation="state.orientation"
  >
    <slot />
  </div>
</template>
