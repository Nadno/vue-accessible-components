<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useDialogProvider } from './useDialogProvider';

import { useFocusOutside, useClickOutside } from '@/composables';

export type DialogContentProps = {
  modal?: boolean;
  loop?: boolean;
  label?: string;
  static?: boolean;
};

export type DialogContentEmits = {
  (e: 'open'): void;
  (e: 'close'): void;
};

const props = defineProps<DialogContentProps>(),
  emit = defineEmits<DialogContentEmits>();

const { ids, triggerRef, dialogRef, setDialogRef, state, close } =
  useDialogProvider('DialogContent');

useClickOutside(() => state.open && !props.static, dialogRef, close);
useFocusOutside(() => state.open && !props.loop, dialogRef, close);

const createModalLoopControllers = () => {
  if (!props.loop) return;

  const $dialog = dialogRef.value;
  if (!$dialog) return;

  const createFocusControl = (redirectTo: 'first' | 'last') => {
    const $control = document.createElement('span');
    $control.tabIndex = 0;
    $control.dataset.focusControl = redirectTo;

    Object.assign($control.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      'white-space': 'nowrap',
      '-webkit-clip-path': 'inset(50%)',
      'clip-path': 'inset(50%)',
      border: 0,
    });

    return $control;
  };

  const $first = createFocusControl('last'),
    $last = createFocusControl('first');

  $dialog.insertAdjacentElement('beforebegin', $first);
  $dialog.insertAdjacentElement('afterend', $last);
};

onMounted(createModalLoopControllers);

watch(
  () => state.open,
  () => (state.open ? emit('open') : emit('close')),
);

const handleToggleModal = () => {
  const $dialog = dialogRef.value,
    $trigger = triggerRef.value;
  if (!$dialog || !$trigger) return;

  requestAnimationFrame(() => {
    if (!state.open) $trigger.focus();
    $dialog.setAttribute('data-state', state.open ? 'open' : 'closed');
    document.body.style.overflow = state.open ? 'hidden' : '';
  });
};

watch(() => state.open, handleToggleModal, {
  flush: 'post',
});

const focusElement = (position = 'first') => {
  const $dialog = dialogRef.value;
  if (!$dialog) return;

  const focusableElements = [
    'a',
    'button',
    'input',
    'select',
    'textarea',
    '[tabindex="0"]',
  ];

  const $first = $dialog.querySelector<HTMLElement>(
    focusableElements
      .map((selector) => `${selector}:${position}-of-type`)
      .join(','),
  );

  if (!$first) return $dialog.focus();
  $first.focus();
};

const handleFocusFirstElementOnOpenModal = () => {
  if (!state.open) return;
  requestAnimationFrame(() => focusElement('first'));
};

watch(() => state.open, handleFocusFirstElementOnOpenModal);

const handleFocusLoop = (e: FocusEvent) => {
  const $next = e.relatedTarget as HTMLElement;

  if (!$next || !$next.hasAttribute('data-focus-control')) return;
  e.stopImmediatePropagation();
  requestAnimationFrame(() => focusElement($next.dataset.focusControl));
};
</script>

<template>
  <div
    v-show="state.open"
    :ref="setDialogRef"
    :aria-modal="modal"
    :data-static="props.static"
    :id="ids.content"
    :aria-label="label"
    @keydown.escape="close"
    @focusout.capture="handleFocusLoop"
    role="dialog"
    tabindex="-1"
    data-dialog
    data-state="closed"
  >
    <slot />
  </div>
</template>
