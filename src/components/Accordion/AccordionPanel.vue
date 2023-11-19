<script lang="ts" setup>
import { computed } from 'vue';

import { useAccordionProvider } from './useAccordionProvider';
import { useAccordionSectionProvider } from './useAccordionSectionProvider';

export type AccordionPanelProps = {
  id?: string;
  headerId?: string;
  detachOnHide?: boolean;
};

const props = withDefaults(defineProps<AccordionPanelProps>(), {
  id: undefined,
  label: undefined,
  headerId: undefined,
  detachOnHide: undefined,
});

const { options, getAccordionTitle } = useAccordionProvider('AccordionPanel');

const { name, isDisabled, isOpened } =
  useAccordionSectionProvider('AccordionPanel');

const id = computed(() => props.id ?? getAccordionTitle(name.value, 'panel')),
  labelId = computed(
    () => props.headerId ?? getAccordionTitle(name.value, 'heading'),
  );

const isDetached = computed(() => {
  const detachOnHide = props.detachOnHide ?? options.value.detachOnHide;
  return detachOnHide ? !isOpened.value : false;
});
</script>

<template>
  <div
    v-if="!isDetached"
    data-accordion-panel
    role="region"
    :id="id"
    :aria-hidden="!isOpened || undefined"
    :aria-labelledby="labelId"
    :data-name="name"
    :data-opened="isOpened"
    :data-disabled="isDisabled"
  >
    <slot />
  </div>
</template>
