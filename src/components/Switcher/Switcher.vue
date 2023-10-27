<script lang="ts">
const BUTTON_NAME_NOT_STRING_ERROR_MESSAGE =
  'The ToggleButton name must be an string!';
</script>

<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useNullableRef } from '@/composables';

import { useSwitcherGroupProvider } from './useSwitcherGroup';
import { SwitcherGroupProvider } from './SwitcherGroup.vue';

export type SwitchProps = {
  name?: string;
  label?: string;
  defaultChecked?: boolean;
  modelValue?: boolean;
  disabled?: boolean;
};

export type ToggleButtonEmits = {
  (type: 'update:modelValue', pressed: boolean): void;
  (type: 'change', pressed: boolean, event: Event): void;
};

const emit = defineEmits<ToggleButtonEmits>();

const props = withDefaults(defineProps<SwitchProps>(), {
  disabled: undefined,
  modelValue: undefined,
  defaultChecked: undefined,
});

const isChecked = props.defaultChecked ?? !!props.modelValue,
  checked = ref(isChecked),
  name = props.name;

const group = useSwitcherGroupProvider(props.name as string, isChecked),
  withGroup = useNullableRef<SwitcherGroupProvider>(group);

const isDisabled = computed(() => {
  if (typeof props.disabled === 'boolean') return props.disabled;
  return withGroup((group) => group.state.disabled);
});

const validateButtonName = () => {
  if (!name) return;
  if (typeof name !== 'string')
    throw new TypeError(BUTTON_NAME_NOT_STRING_ERROR_MESSAGE);
};

onBeforeMount(validateButtonName);

const updatePressedValueOnGroupChange = () => {
  if (!group || !name || !group.has(name)) return;

  const newValue = group.isChecked(name);
  if (checked.value === newValue) return;

  const hasModelValue = typeof props.modelValue === 'boolean';
  if (hasModelValue) return emit('update:modelValue', newValue);

  checked.value = newValue;
};

watch(
  () => group && name && group.state.checkers[name],
  updatePressedValueOnGroupChange,
);

watch(
  () => props.modelValue,
  () => (checked.value = !!props.modelValue),
);

const handleChange = (e: Event) => {
  if (isDisabled.value) return;

  const pressedValue = !checked.value;

  checked.value = pressedValue;

  emit('update:modelValue', pressedValue);
  emit('change', pressedValue, e);
  withGroup((group) => group.change(name as string, pressedValue, e));
};
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-label="label"
    :aria-checked="checked"
    :aria-disabled="isDisabled || undefined"
    :tabindex="group && -1"
    :data-name="name"
    :data-checked="checked"
    :data-disabled="isDisabled || undefined"
    @click="handleChange"
  >
    <slot />
  </button>
</template>
