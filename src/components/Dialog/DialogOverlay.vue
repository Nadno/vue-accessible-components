<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDialogProvider } from './useDialogProvider';

const dialogOverlayRef = ref<HTMLElement | null>(null);

const { state } = useDialogProvider('DialogOverlay');

const handleToggleModal = () => {
  const $overlay = dialogOverlayRef.value;
  if (!$overlay) return;

  requestAnimationFrame(() => {
    const currentState = state.open ? 'open' : 'closed';
    $overlay.setAttribute('data-state', currentState);
  });
};

watch(() => state.open, handleToggleModal, {
  flush: 'post',
});
</script>

<template>
  <div
    ref="dialogOverlayRef"
    data-dialog-overlay
    data-state="closed"
    v-show="state.open"
  >
    <slot />
  </div>
</template>
