<script lang="ts" setup>
import { computed } from 'vue';
import { useAccordionProvider } from './useAccordionProvider';
import { useAccordionSectionProvider } from './useAccordionSectionProvider';

export type AccordionTriggerProps = {
  id?: string;
  panelId?: string;
  disabled?: boolean;
};

const props = withDefaults(defineProps<AccordionTriggerProps>(), {
  id: undefined,
  panelId: undefined,
  disabled: undefined,
});

const { toggle, getAccordionTitle } = useAccordionProvider('AccordionTrigger');

const { name, isDisabled, isOpened } =
  useAccordionSectionProvider('AccordionTrigger');

const id = computed(() => props.id ?? getAccordionTitle(name.value, 'trigger')),
  controlledPanelId = computed(
    () => props.panelId ?? getAccordionTitle(name.value, 'panel'),
  );

const handleToggleAccordion = () => {
  if (isDisabled.value) return;
  toggle(name.value);
};
</script>

<template>
  <button
    data-accordion-trigger
    type="button"
    :id="id"
    :aria-disabled="isDisabled || undefined"
    :aria-expanded="isOpened"
    :aria-controls="controlledPanelId"
    :data-name="name"
    :data-opened="isOpened"
    :data-disabled="isDisabled || undefined"
    @click="handleToggleAccordion"
  >
    <slot />
  </button>
</template>
