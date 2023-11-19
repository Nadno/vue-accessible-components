<script lang="ts">
export const DROPDOWN_MENU_CHECKBOX_GROUP_PROVIDER_NAME =
  'toggle-button-group-provider';

const MISSING_CHECKBOX_NAME_ERROR_MESSAGE = `The ${DROPDOWN_MENU_ITEM_CHECKBOX_NAME} must have a name when used within a DropdownMenuCheckboxGroup!`;
</script>

<script lang="ts" setup>
import { provide, ref, onUpdated, watch, onMounted } from 'vue';
import {
  useCheckGroup,
  CheckGroupOptions,
  CheckGroup,
  KeyboardArrowFocusOrientations,
} from '@/composables';

import { MENU_ITEM_SELECTOR } from './DropdownMenuContent.vue';
import { DROPDOWN_MENU_ITEM_CHECKBOX_NAME } from './useDropdownMenuCheckboxGroup';

export type ChangeHandler = (
  name: string,
  pressed: boolean,
  event: Event,
) => void;

export type CheckboxGroupProvider = {
  change: ChangeHandler;
} & CheckGroup;

export type CheckboxGroupRovingFocusOrientations =
  KeyboardArrowFocusOrientations;

export type CheckboxGroupProps = {
  disabled?: boolean;
  defaultChecked?: string;
  allowAllUnchecked?: boolean;
  modelValue?: Record<string, boolean>;
};

export type CheckboxGroupEmits = {
  (type: 'update:modelValue', checkers: Record<string, boolean>): void;
  (type: 'onChange', name: string, checked: boolean, event: Event): void;
};

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  disabled: undefined,
  allowAllUnchecked: true,
});

const emit = defineEmits<CheckboxGroupEmits>();

const getCheckGroupOptions = (): CheckGroupOptions => ({
  allowAllUnchecked: props.allowAllUnchecked,
  disabled: props.disabled,
  defaultChecked: props.defaultChecked,
  multiple: true,
});

const $group = ref<HTMLElement | null>(null),
  group = useCheckGroup(getCheckGroupOptions(), {
    missingNameOnRegister: MISSING_CHECKBOX_NAME_ERROR_MESSAGE,
    registeredChecker: `The ${DROPDOWN_MENU_ITEM_CHECKBOX_NAME} name "{{name}}" has already been used!`,
  });

const updateCheckGroupOptions = () =>
  Object.assign(group.state, getCheckGroupOptions());

onUpdated(updateCheckGroupOptions);

const updateCheckGroupValues = (data?: Record<string, boolean>) => {
  if (!data) return;

  Object.entries(data).forEach(([name, checked]) => {
    console.log({
      name,
      checkers: { ...group.state.checkers },
    });
    if (!group.has(name))
      throw new Error(
        `There is no ${DROPDOWN_MENU_ITEM_CHECKBOX_NAME} with name "${name}"!`,
      );

    group.state.checkers[name] = checked;
    if (checked) group.preventMultipleChecked(name);
  });
};

watch(() => props.modelValue, updateCheckGroupValues);

onMounted(() => updateCheckGroupValues(props.modelValue));

const change: ChangeHandler = (name, checked, event) => {
  if (!group.has(name)) return;

  group.state.checkers[name] = checked;
  emit('onChange', name, checked, event);

  if (checked) group.preventMultipleChecked(name);
  if (!checked) group.preventAllUnchecked(name);

  emit('update:modelValue', { ...group.state.checkers });
};

provide<CheckboxGroupProvider>(DROPDOWN_MENU_CHECKBOX_GROUP_PROVIDER_NAME, {
  ...group,
  change,
});

const handleFocus = () => {
  const $checkboxgroup = $group.value;
  if (!$checkboxgroup) return;

  $checkboxgroup.querySelector<HTMLElement>(`${MENU_ITEM_SELECTOR}`)?.focus();
};
</script>

<template>
  <div
    role="group"
    ref="$group"
    tabindex="-1"
    data-menu-group="checkbox"
    :aria-disabled="group.state.disabled || undefined"
    :data-disabled="group.state.disabled || undefined"
    @focus="handleFocus"
  >
    <slot />
  </div>
</template>
