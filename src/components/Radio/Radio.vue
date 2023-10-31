<script lang="ts">
const RADIO_NAME_NOT_STRING_ERROR_MESSAGE =
  'The ToggleButton name must be an string!';
</script>

<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useRadioGroupProvider } from './useRadioGroup';

export type RadioProps = {
  name: string;
  label?: string;
  defaultChecked?: boolean;
  modelValue?: boolean;
  disabled?: boolean;
};

export type RadioEmits = {
  (type: 'update:modelValue', pressed: boolean): void;
  (type: 'change', pressed: boolean, event: Event): void;
};

const emit = defineEmits<RadioEmits>();

const props = withDefaults(defineProps<RadioProps>(), {
  disabled: undefined,
  modelValue: undefined,
  defaultChecked: undefined,
});

const isChecked = props.defaultChecked ?? !!props.modelValue,
  checked = ref(isChecked),
  name = props.name;

const group = useRadioGroupProvider(name, isChecked);

const isDisabled = computed(() => {
  if (typeof props.disabled === 'boolean') return props.disabled;
  return group.state.disabled;
});

const validateButtonName = () => {
  if (!name) return;
  if (typeof name !== 'string')
    throw new TypeError(RADIO_NAME_NOT_STRING_ERROR_MESSAGE);
};

onBeforeMount(validateButtonName);

const updateCheckedValueOnGroupChange = () => {
  if (!group || !name || !group.has(name)) return;

  const newValue = group.isChecked(name);
  if (checked.value === newValue) return;

  const hasModelValue = typeof props.modelValue === 'boolean';
  if (hasModelValue) return emit('update:modelValue', newValue);

  checked.value = newValue;
};

watch(
  () => group && name && group.state.checkers[name],
  updateCheckedValueOnGroupChange,
);

watch(
  () => props.modelValue,
  () => (checked.value = !!props.modelValue),
);

const handleChange = (e: Event) => {
  if (isDisabled.value || group.isChecked(name)) return;

  const checkedValue = !checked.value;

  checked.value = checkedValue;

  emit('update:modelValue', checkedValue);
  emit('change', checkedValue, e);
  group.change(name, checkedValue, e);
};
</script>

<template>
  <button
    type="button"
    role="radio"
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
