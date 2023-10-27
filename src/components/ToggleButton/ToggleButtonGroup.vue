<script lang="ts">
export const TOGGLE_BUTTON_GROUP_PROVIDER_NAME = 'toggle-button-group-provider';

const MISSING_BUTTON_NAME_ERROR_MESSAGE =
  'The ToggleButton must have a name when used within a ToggleButtonGroup!';
</script>

<script lang="ts" setup>
import { nextTick, onUpdated, provide, ref } from 'vue';
import {
  CheckGroup,
  CheckGroupOptions,
  KeyboardArrowFocusOrientations,
  useCheckGroup,
  useKeyboardArrowFocus,
} from '@/composables';

export type ChangeHandler = (
  name: string,
  pressed: boolean,
  event: Event,
) => void;

export type ToggleButtonGroupProvider = CheckGroup & {
  change: ChangeHandler;
};

export type ToggleButtonGroupRovingFocusOrientation =
  KeyboardArrowFocusOrientations;

export type ToggleButtonGroupProps = {
  disabled?: boolean;
  multiple?: boolean;
  defaultPressed?: string;
  allowAllUnpressed?: boolean;
  useTabFocusing?: boolean;
  useFocusLooping?: boolean;
  focusOrientation?: ToggleButtonGroupRovingFocusOrientation;
};

export type ToggleButtonGroupEmits = {
  (type: 'onChange', name: string, pressed: boolean, event: Event): void;
};

const props = withDefaults(defineProps<ToggleButtonGroupProps>(), {
  disabled: undefined,
  multiple: undefined,
  focusOrientation: 'horizontal',
});

const emit = defineEmits<ToggleButtonGroupEmits>();

const getCheckGroupOptions = (): CheckGroupOptions => ({
  allowAllUnchecked: props.allowAllUnpressed,
  disabled: props.disabled,
  defaultChecked: props.defaultPressed,
  multiple: props.multiple,
});

const $group = ref<HTMLElement | null>(null),
  group = useCheckGroup(getCheckGroupOptions(), {
    missingNameOnRegister: MISSING_BUTTON_NAME_ERROR_MESSAGE,
    registeredChecker:
      'The ToggleButton name "{{name}}" has already been used!',
  });

useKeyboardArrowFocus({
  componentName: 'ToggleButtonGroup',
  container: $group,
  direction: props.focusOrientation,
  target: '[data-name]',
  allowTabFocusing: props.useTabFocusing,
  loop: props.useFocusLooping,
});

const updateCheckGroupOptions = () =>
  Object.assign(group.state, getCheckGroupOptions());

onUpdated(updateCheckGroupOptions);

const change: ChangeHandler = (name, pressed, event) => {
  group.state.checkers[name] = pressed;
  emit('onChange', name, pressed, event);

  if (pressed) group.preventMultipleChecked(name);
  if (!pressed) nextTick(() => group.preventAllUnchecked(name));
};

provide<ToggleButtonGroupProvider>(TOGGLE_BUTTON_GROUP_PROVIDER_NAME, {
  ...group,
  change,
});
</script>

<template>
  <div
    role="group"
    ref="$group"
    :aria-disabled="group.state.disabled || undefined"
    :data-disabled="group.state.disabled || undefined"
    :data-multiple="multiple || undefined"
    :data-focus-orientation="focusOrientation"
  >
    <slot />
  </div>
</template>
