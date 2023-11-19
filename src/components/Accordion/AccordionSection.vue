<script lang="ts">
export const ACCORDION_SECTION_PROVIDER_NAME = 'accordion-section-provider';
</script>

<script lang="ts" setup>
import { Ref, computed, onMounted, onUnmounted, provide, watch } from 'vue';
import { useAccordionProvider } from './useAccordionProvider';

export type AccordionSectionProvider = {
  name: Ref<string>;
  isDisabled: Ref<boolean>;
  isOpened: Ref<boolean>;
};

export type AccordionSectionProps = {
  name: string;
  disabled?: boolean;
  opened?: boolean;
  defaultOpened?: boolean;
};

const props = withDefaults(defineProps<AccordionSectionProps>(), {
  id: undefined,
  disabled: undefined,
  opened: undefined,
  defaultOpened: false,
});

const { accordions, options, toggle, register, unregister } =
  useAccordionProvider('AccordionSection');

const sectionName = computed(() => props.name);

const isDisabled = computed(() => {
  const shouldAvoidAllAccordionsClosed = options.value.avoidAllPanelsClosed,
    isTheOnlyAccordionOpened = Object.entries(accordions)
      .filter(([name]) => name !== props.name)
      .every(([, value]) => !value),
    isDisabledByAvoidingAllClosed =
      shouldAvoidAllAccordionsClosed && isTheOnlyAccordionOpened;

  if (isDisabledByAvoidingAllClosed) return isDisabledByAvoidingAllClosed;

  if (typeof props.disabled === 'boolean') return props.disabled;

  return options.value.disabled;
});

const isOpened = computed(() => !!accordions[sectionName.value]);

onMounted(() => register(sectionName.value, props.defaultOpened));
onUnmounted(() => unregister(sectionName.value));

const bindAccordionPanelOpened = () => {
  if (props.opened == null) return;
  toggle(sectionName.value, !!props.opened);
};

watch(() => props.opened, bindAccordionPanelOpened, { flush: 'pre' });

const handleAccordionRegistering = (
  newName: string,
  oldName: string | null,
) => {
  if (!oldName) return;
  unregister(oldName);
  register(newName, !!props.opened);
};

watch(sectionName, handleAccordionRegistering);

provide(ACCORDION_SECTION_PROVIDER_NAME, {
  name: sectionName,
  isDisabled,
  isOpened,
});
</script>

<template>
  <div
    data-accordion-section
    :data-name="name"
    :data-opened="isOpened"
    :data-disabled="isDisabled || undefined"
  >
    <slot />
  </div>
</template>
