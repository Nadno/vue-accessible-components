<script setup lang="ts" generic="TValue">
export type DropdownMenuItemProps<TValue> = {
  value?: TValue;
  modelValue?: TValue;
  disabled?: boolean;
  autoclose?: boolean;
};

export type DropdownMenuItemEmits<TValue> = {
  (e: 'update:modelValue', value?: TValue): void;
  (e: 'onSelect', value?: TValue): void;
};

const emit = defineEmits<DropdownMenuItemEmits<TValue>>(),
  props = withDefaults(defineProps<DropdownMenuItemProps<TValue>>(), {
    value: undefined,
    disabled: undefined,
    autoclose: undefined,
  });

const handleSelectMenuItem = () => {
  if (props.disabled) return;
  emit('update:modelValue', props.value);
  emit('onSelect', props.value);
};
</script>

<template>
  <button
    type="button"
    role="menuitem"
    tabindex="-1"
    data-menu-item="button"
    :data-disabled="disabled"
    :data-autoclose="autoclose"
    :aria-disabled="disabled"
    @click="handleSelectMenuItem"
  >
    <slot />
  </button>
</template>
