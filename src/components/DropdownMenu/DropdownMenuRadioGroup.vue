<script lang="ts">
export const DROPDOWN_MENU_RADIO_GROUP_PROVIDER_NAME =
  'toggle-button-group-provider';

const MISSING_RADIO_NAME_ERROR_MESSAGE = `The ${DROPDOWN_MENU_ITEM_RADIO_NAME} must have a name when used within a RadioGroup!`;
</script>

<script lang="ts" setup>
import { provide, ref, onUpdated, watch } from 'vue';
import {
  useCheckGroup,
  CheckGroupOptions,
  CheckGroup,
  KeyboardArrowFocusOrientations,
} from '@/composables';
import { MENU_ITEM_SELECTOR } from './DropdownMenuContent.vue';
import { DROPDOWN_MENU_ITEM_RADIO_NAME } from './useDropdownMenuRadioGroup';

export type RadioChangeHandler = (
  name: string,
  pressed: boolean,
  event: Event,
) => void;

export type RadioGroupProvider = {
  change: RadioChangeHandler;
} & CheckGroup;

export type RadioGroupRovingFocusOrientations = KeyboardArrowFocusOrientations;

export type RadioGroupProps = {
  useAutoCheck?: boolean;
  disabled?: boolean;
  defaultChecked?: string;
  allowAllUnchecked?: boolean;
  modelValue?: string;
};

export type RadioGroupEmits = {
  (type: 'update:modelValue', name: string): void;
  (type: 'onChange', name: string, pressed: boolean, event: Event): void;
};

const props = withDefaults(defineProps<RadioGroupProps>(), {
  disabled: undefined,
  focusOrientation: 'horizontal',
});

const emit = defineEmits<RadioGroupEmits>();

const getCheckGroupOptions = (): CheckGroupOptions => ({
  allowAllUnchecked: props.allowAllUnchecked,
  disabled: props.disabled,
  defaultChecked: props.modelValue ?? props.defaultChecked,
  multiple: false,
});

const $group = ref<HTMLElement | null>(null),
  group = useCheckGroup(getCheckGroupOptions(), {
    missingNameOnRegister: MISSING_RADIO_NAME_ERROR_MESSAGE,
    registeredChecker: `The ${DROPDOWN_MENU_ITEM_RADIO_NAME} name "{{name}}" has already been used!`,
  });

const updateCheckGroupOptions = () =>
  Object.assign(group.state, getCheckGroupOptions());

onUpdated(updateCheckGroupOptions);

watch(
  () => props.modelValue,
  (checkedName) => {
    if (!checkedName) return;

    if (!group.has(checkedName))
      throw new Error(
        `There is no ${DROPDOWN_MENU_ITEM_RADIO_NAME} with name "${checkedName}"!`,
      );

    group.state.checkers[checkedName] = true;
    group.preventMultipleChecked(checkedName);
  },
);

const change: RadioChangeHandler = (name, checked, event) => {
  if (!group.has(name)) return;

  group.state.checkers[name] = checked;
  emit('onChange', name, checked, event);

  if (checked) group.preventMultipleChecked(name);
  if (!checked) group.preventAllUnchecked(name);

  emit('update:modelValue', name);
};

provide<RadioGroupProvider>(DROPDOWN_MENU_RADIO_GROUP_PROVIDER_NAME, {
  ...group,
  change,
});

const handleRadioAutoCheck = (e: Event) => {
  if (!props.useAutoCheck) return;

  const $target = e.target as HTMLElement;
  if (!$target) return;
  $target.click();
};

const handleFocus = () => {
  const $radiogroup = $group.value;
  if (!$radiogroup) return;

  const $checked = $radiogroup.querySelector<HTMLElement>(
    `${MENU_ITEM_SELECTOR}[data-checked='true']`,
  );

  if ($checked) return $checked.focus();

  $radiogroup.querySelector<HTMLElement>(`${MENU_ITEM_SELECTOR}`)?.focus();
};
</script>

<template>
  <div
    role="radiogroup"
    ref="$group"
    tabindex="-1"
    data-menu-group="radio"
    :aria-disabled="group.state.disabled || undefined"
    :data-disabled="group.state.disabled || undefined"
    :data-auto-check="useAutoCheck"
    @focusin="handleRadioAutoCheck"
    @focus="handleFocus"
  >
    <slot />
  </div>
</template>
