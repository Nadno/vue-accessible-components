<script lang="ts">
export const TOGGLE_BUTTON_GROUP_PROVIDER_NAME = 'toggle-button-group-provider';

const MISSING_BUTTON_NAME_ERROR_MESSAGE =
  'The ToggleButton must have a name when used within a ToggleButtonGroup!';
</script>

<script lang="ts" setup>
import {
  KeyboardArrowFocusOrientations,
  useKeyboardArrowFocus,
} from '@/composables';
import { computed, nextTick, provide, reactive, ref, Ref } from 'vue';

export type RegisterHandler = (name: string, pressed: boolean) => void;

export type UnregisterHandler = (name: string) => void;

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

const $group = ref<HTMLElement | null>(null),
  buttons: Record<string, boolean> = reactive({}),
  isDisabled = computed(() => props.disabled);

useKeyboardArrowFocus({
  componentName: 'ToggleButtonGroup',
  container: $group,
  direction: props.focusOrientation,
  target: '[data-name]',
  allowTabFocusing: props.useTabFocusing,
  loop: props.useFocusLooping,
});

const hasButton = (name: string) => Object.hasOwn(buttons, name);

const preventMultiplePressed = (name: string) => {
  if (props.multiple) return;
  const currentPressed = Object.entries(buttons).find(
    ([currentName, currentPressed]) => currentPressed && currentName !== name,
  );

  if (!currentPressed) return;
  const [currentPressedName] = currentPressed;
  buttons[currentPressedName] = false;
};

const preventAllUnpressed = () => {
  if (props.allowAllUnpressed) return;
  const defaultName = props.defaultPressed;
  if (!defaultName || typeof defaultName !== 'string') return;

  const isAllUnpressed = Object.values(buttons).every((pressed) => !pressed);
  if (!isAllUnpressed) return;

  buttons[defaultName] = true;
};

const register: RegisterHandler = (name, pressed) => {
  if (!name) throw new Error(MISSING_BUTTON_NAME_ERROR_MESSAGE);

  if (hasButton(name))
    throw new Error(
      'You cannot have multiple ToggleButton with the same name. \n' +
        `Repeated name: "${name}."`,
    );

  if (pressed) preventMultiplePressed(name);
  buttons[name] = pressed;
  if (!pressed) preventAllUnpressed();
};

const unregister: UnregisterHandler = (name) => {
  if (!name) throw new Error(MISSING_BUTTON_NAME_ERROR_MESSAGE);
  delete buttons[name];
};

const change: ChangeHandler = (name, pressed, event) => {
  if (pressed) preventMultiplePressed(name);

  buttons[name] = pressed;
  emit('onChange', name, pressed, event);

  if (!pressed) nextTick(preventAllUnpressed);
};

provide<ToggleButtonGroupProvider>(TOGGLE_BUTTON_GROUP_PROVIDER_NAME, {
  buttons,
  register,
  unregister,
  change,
  isDisabled,
});
</script>

<template>
  <div
    role="group"
    ref="$group"
    :aria-disabled="disabled || undefined"
    :data-disabled="disabled || undefined"
    :data-multiple="multiple || undefined"
    :data-focus-orientation="focusOrientation"
  >
    <slot />
  </div>
</template>
