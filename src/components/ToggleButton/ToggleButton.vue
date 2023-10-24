<script lang="ts">
const BUTTON_NAME_NOT_STRING_ERROR_MESSAGE =
  'The ToggleButton name must be an string!';
</script>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useNullableRef } from '@/composables';

import { useToggleButtonGroupProvider } from './useToggleButtonGroup';
import { ToggleButtonGroupProvider } from './ToggleButtonGroup.vue';

export type ToggleButtonProps = {
  name?: string;
  label?: string;
  defaultPressed?: boolean;
  modelValue?: boolean;
  disabled?: boolean;
};

export type ToggleButtonEmits = {
  (type: 'update:modelValue', pressed: boolean): void;
  (type: 'change', pressed: boolean, event: Event): void;
};

const emit = defineEmits<ToggleButtonEmits>();

const props = withDefaults(defineProps<ToggleButtonProps>(), {
  disabled: undefined,
  modelValue: undefined,
  defaultPressed: undefined,
});

const isPressed = props.defaultPressed ?? !!props.modelValue,
  pressed = ref(isPressed),
  name = props.name;

const isDisabled = computed(() => {
  if (typeof props.disabled === 'boolean') return props.disabled;
  return withGroup((group) => group.isDisabled.value);
});

const group = useToggleButtonGroupProvider(props.name as string, isPressed),
  withGroup = useNullableRef<ToggleButtonGroupProvider>(group);

const validateButtonName = () => {
  if (!name) return;
  if (typeof name !== 'string')
    throw new TypeError(BUTTON_NAME_NOT_STRING_ERROR_MESSAGE);
};

onMounted(validateButtonName);

const updatePressedValueOnGroupChange = () => {
  if (!group || !name) return;
  if (!Object.hasOwn(group.buttons, name)) return;

  const newValue = group.buttons[name as string];
  if (pressed.value === newValue) return;

  const hasModelValue = typeof props.modelValue === 'boolean';
  if (hasModelValue) return emit('update:modelValue', newValue);

  pressed.value = newValue;
};

watch(
  () => group && name && group.buttons[name],
  updatePressedValueOnGroupChange,
);

watch(
  () => props.modelValue,
  () => (pressed.value = !!props.modelValue),
);

const handleChange = (e: Event) => {
  if (isDisabled.value) return;

  const pressedValue = !pressed.value;

  pressed.value = pressedValue;

  emit('update:modelValue', pressedValue);
  emit('change', pressedValue, e);
  withGroup((group) => group.change(name as string, pressedValue, e));
};
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    :aria-pressed="pressed"
    :aria-disabled="isDisabled"
    :data-name="name"
    :data-pressed="pressed"
    :data-disabled="isDisabled"
    @click="handleChange"
  >
    <slot />
  </button>
</template>
