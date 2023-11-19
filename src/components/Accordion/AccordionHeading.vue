<script lang="ts" setup>
import { computed } from 'vue';

import { useAccordionProvider } from './useAccordionProvider';
import { useAccordionSectionProvider } from './useAccordionSectionProvider';

export type AccordionHeadingProps = {
  is?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  id?: string;
  panelId?: string;
  useToggleOnClick?: boolean;
};

const props = withDefaults(defineProps<AccordionHeadingProps>(), {
  id: undefined,
  panelId: undefined,
  disabled: undefined,
  useToggleOnClick: false,
});

const { toggle, getAccordionTitle } = useAccordionProvider('AccordionHeading');

const { name, isDisabled } = useAccordionSectionProvider('AccordionHeading');

const id = computed(() => props.id ?? getAccordionTitle(name.value, 'heading'));

const handleToggleAccordion = (e: MouseEvent) => {
  if (!props.useToggleOnClick || isDisabled.value) return;

  const $target = e.target as HTMLElement | null;
  if ($target && $target.matches('[data-accordion-trigger]')) return;

  toggle(name.value);
};
</script>

<template>
  <component
    data-accordion-heading
    :is="is || 'h2'"
    :id="id"
    @click="handleToggleAccordion"
  >
    <slot />
  </component>
</template>
