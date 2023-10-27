<script lang="ts">
export const SWITCH_GROUP_PROVIDER_NAME = 'toggle-button-group-provider';

const MISSING_SWITCH_NAME_ERROR_MESSAGE =
  'The Switcher must have a name when used within a SwitchGroup!';
</script>

<script lang="ts" setup>
import {
  useCheckGroup,
  CheckGroupOptions,
  CheckGroup,
  useKeyboardArrowFocus,
  KeyboardArrowFocusOrientations,
} from '@/composables';
import { nextTick, provide, ref, onUpdated } from 'vue';

export type ChangeHandler = (
  name: string,
  pressed: boolean,
  event: Event,
) => void;

export type SwitcherGroupProvider = {
  change: ChangeHandler;
} & CheckGroup;

export type SwitcherGroupRovingFocusOrientations = KeyboardArrowFocusOrientations;

export type SwitcherGroupProps = {
  disabled?: boolean;
  multiple?: boolean;
  defaultChecked?: string;
  allowAllUnpressed?: boolean;
  useFocusLooping?: boolean;
  useTabFocusing?: boolean;
  focusOrientation?: SwitcherGroupRovingFocusOrientations;
};

export type SwitchGroupEmits = {
  (type: 'onChange', name: string, pressed: boolean, event: Event): void;
};

const props = withDefaults(defineProps<SwitcherGroupProps>(), {
  disabled: undefined,
  multiple: undefined,
  focusOrientation: 'horizontal',
});

const emit = defineEmits<SwitchGroupEmits>();

const getCheckGroupOptions = (): CheckGroupOptions => ({
  allowAllUnchecked: props.allowAllUnpressed,
  disabled: props.disabled,
  defaultChecked: props.defaultChecked,
  multiple: props.multiple,
});

const $group = ref<HTMLElement | null>(null),
  group = useCheckGroup(getCheckGroupOptions(), {
    missingNameOnRegister: MISSING_SWITCH_NAME_ERROR_MESSAGE,
    registeredChecker: 'The Switcher name "{{name}}" has already been used!',
  });

useKeyboardArrowFocus({
  componentName: 'SwitcherGroup',
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
  if (!group.has(name)) return;

  group.state.checkers[name] = pressed;
  emit('onChange', name, pressed, event);

  if (pressed) group.preventMultipleChecked(name);
  if (!pressed) nextTick(() => group.preventAllUnchecked(name));
};

provide<SwitcherGroupProvider>(SWITCH_GROUP_PROVIDER_NAME, {
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
    :data-multiple="group.state.multiple || undefined"
    :data-focus-orientation="focusOrientation"
  >
    <slot />
  </div>
</template>
