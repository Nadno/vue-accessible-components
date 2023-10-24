<script lang="ts">
export const TOGGLE_BUTTON_GROUP_PROVIDER_NAME = 'toggle-button-group-provider';

const MISSING_BUTTON_NAME_ERROR_MESSAGE =
  'The ToggleButton must have a name when used within a ToggleButtonGroup!';
</script>

<script lang="ts" setup>
import { useNullableRef } from '@/composables';
import { computed, nextTick, provide, reactive, ref, Ref } from 'vue';

export type RegisterHandler = (name: string, pressed: boolean) => void;

export type UnregisterHandler = (name: string) => void;

export type ChangeHandler = (
  name: string,
  pressed: boolean,
  event: Event,
) => void;

export type ToggleButtonGroupProvider = {
  buttons: Record<string, boolean>;
  register: RegisterHandler;
  unregister: UnregisterHandler;
  change: ChangeHandler;
  isDisabled: Ref<boolean>;
};

export type ToggleButtonGroupProps = {
  disabled?: boolean;
  multiple?: boolean;
  defaultPressed?: string;
  allowAllUnpressed?: boolean;
  useTabFocusing?: boolean;
};

export type ToggleButtonGroupEmits = {
  (type: 'onChange', name: string, pressed: boolean, event: Event): void;
};

const props = withDefaults(defineProps<ToggleButtonGroupProps>(), {
  disabled: undefined,
  multiple: undefined,
});

const emit = defineEmits<ToggleButtonGroupEmits>();

const $group = ref<HTMLElement | null>(null),
  buttons: Record<string, boolean> = reactive({}),
  isDisabled = computed(() => props.disabled);

const withGroupElement = useNullableRef<HTMLElement>($group);

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

const focusSibling = ($target: HTMLElement, direction: 'prev' | 'next') => {
  if (!$target) return;

  const $next = $target[
    direction === 'next' ? 'nextElementSibling' : 'previousElementSibling'
  ] as HTMLElement | null;

  if (!$next) return;

  const nextName = $next.dataset.name;
  if (!nextName) return;

  if (hasButton(nextName)) $next.focus();
};

const handleFocusNext = (e: Event) => {
  withGroupElement(($group) => {
    if (document.activeElement === $group) {
      const $firstChild = $group.firstElementChild as HTMLElement | null;
      if ($firstChild) $firstChild.focus();
      return;
    }

    const $target = e.target as HTMLElement;
    focusSibling($target, 'next');
  });
};

const handleFocusPrev = (e: Event) => {
  withGroupElement(($group) => {
    if (document.activeElement === $group) {
      const $lastChild = $group.lastElementChild as HTMLElement | null;
      if ($lastChild) $lastChild.focus();
      return;
    }

    const $target = e.target as HTMLElement;
    focusSibling($target, 'prev');
  });
};

const handleStartFocusingOutside = () => {
  if (props.useTabFocusing) return;

  withGroupElement(($group) => {
    const $items = $group.querySelectorAll('[data-name]');
    $items.forEach(($item) => $item.setAttribute('tabindex', '-1'));
  });
};

const handleEndFocusingOutside = () => {
  if (props.useTabFocusing) return;

  withGroupElement(($group) => {
    const $items = $group.querySelectorAll('[data-name]');
    $items.forEach(($item) => $item.removeAttribute('tabindex'));
  });
};
</script>

<template>
  <div
    role="group"
    ref="$group"
    :aria-disabled="disabled"
    :data-disabled="disabled"
    :data-multiple="multiple"
    @keydown.right="handleFocusNext"
    @keydown.left="handleFocusPrev"
    @keydown.tab.capture="handleStartFocusingOutside"
    @focusout="handleEndFocusingOutside"
  >
    <slot />
  </div>
</template>
