<script lang="ts">
export const RADIO_GROUP_PROVIDER_NAME = 'toggle-button-group-provider';

const MISSING_RADIO_NAME_ERROR_MESSAGE =
  'The Radio must have a name when used within a RadioGroup!';
</script>

<script lang="ts" setup>
import { nextTick, provide, ref, onUpdated, watch } from 'vue';
import {
  useCheckGroup,
  CheckGroupOptions,
  CheckGroup,
  useKeyboardArrowFocus,
  KeyboardArrowFocusOrientations,
} from '@/composables';

export type ChangeHandler = (
  name: string,
  pressed: boolean,
  event: Event,
) => void;

export type RadioGroupProvider = {
  change: ChangeHandler;
} & CheckGroup;

export type RadioGroupRovingFocusOrientations = KeyboardArrowFocusOrientations;

export type RadioGroupProps = {
  useAutoCheck?: boolean;
  disabled?: boolean;
  defaultChecked?: string;
  allowAllUnpressed?: boolean;
  useFocusLooping?: boolean;
  focusOrientation?: RadioGroupRovingFocusOrientations;
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
  allowAllUnchecked: props.allowAllUnpressed,
  disabled: props.disabled,
  defaultChecked: props.modelValue ?? props.defaultChecked,
  multiple: false,
});

const $group = ref<HTMLElement | null>(null),
  group = useCheckGroup(getCheckGroupOptions(), {
    missingNameOnRegister: MISSING_RADIO_NAME_ERROR_MESSAGE,
    registeredChecker: 'The Radio name "{{name}}" has already been used!',
  });

useKeyboardArrowFocus({
  componentName: 'RadioGroup',
  container: $group,
  direction: props.focusOrientation,
  target: '[data-name]',
  allowTabFocusing: false,
  loop: props.useFocusLooping,
  handleTabindex($container) {
    nextTick(() => {
      const $checked = $container.querySelector<HTMLElement>(
        '[data-checked="true"]',
      );

      if (!$checked) {
        const $first = $container.querySelector<HTMLElement>('[data-checked]');
        if ($first) $first.setAttribute('tabindex', '0');
        return;
      }

      $checked.setAttribute('tabindex', '0');
    });
  },
});

const updateCheckGroupOptions = () =>
  Object.assign(group.state, getCheckGroupOptions());

onUpdated(updateCheckGroupOptions);

watch(
  () => props.modelValue,
  (checkedName) => {
    if (!checkedName) return;

    if (!group.has(checkedName))
      throw new Error(`There is no Radio with name "${checkedName}!"`);

    group.state.checkers[checkedName] = true;
    group.preventMultipleChecked(checkedName);
  },
);

const change: ChangeHandler = (name, checked, event) => {
  if (!group.has(name)) return;

  group.state.checkers[name] = checked;
  emit('onChange', name, checked, event);

  if (checked) group.preventMultipleChecked(name);
  if (!checked) group.preventAllUnchecked(name);

  emit('update:modelValue', name);
};

provide<RadioGroupProvider>(RADIO_GROUP_PROVIDER_NAME, {
  ...group,
  change,
});

const handleRadioAutoCheck = (e: Event) => {
  if (!props.useAutoCheck) return;

  const $target = e.target as HTMLElement;
  if (!$target) return;
  $target.click();
};
</script>

<template>
  <div
    role="radiogroup"
    ref="$group"
    :aria-disabled="group.state.disabled || undefined"
    :data-disabled="group.state.disabled || undefined"
    :data-focus-orientation="focusOrientation"
    :data-auto-check="useAutoCheck"
    @focusin="handleRadioAutoCheck"
  >
    <slot />
  </div>
</template>
