<script lang="ts" setup>
import { computed } from 'vue';
import { useTabProvider } from './useTabProvider';

export type TabItemProps = {
  name?: string;
  selected?: boolean;
  disabled?: boolean;
};

export type TabItemSelectEvent = {
  event: Event;
  selected?: string;
  selecting?: string;
};

export type TabItemEvents = {
  (type: 'select', event: TabItemSelectEvent): void;
};

const props = withDefaults(defineProps<TabItemProps>(), {
  selected: undefined,
  disabled: undefined,
  name: undefined,
});

const emit = defineEmits<TabItemEvents>();

const { id, state } = useTabProvider('TabItem');

const isSelected = computed(() =>
  props.selected == null ? state.selectedName === props.name : props.selected,
);

const isControlledTab = props.selected != null;

const handleSelectTab = (e: MouseEvent) => {
  emit('select', {
    event: e,
    selected: state.selectedName,
    selecting: props.name,
  });

  if (!isControlledTab) state.selectedName = String(props.name);
};
</script>

<template>
  <button
    data-tab-item
    type="button"
    role="tab"
    tabindex="-1"
    :id="`tab-item-[${id}]-[${name}]`"
    :name="name"
    :aria-disabled="disabled"
    :aria-selected="isSelected"
    :data-disabled="disabled"
    :data-selected="isSelected || undefined"
    :data-name="name"
    @click="handleSelectTab"
  >
    <slot />
  </button>
</template>
