<script setup lang="ts">
import { onMounted } from 'vue';
import { useDialogProvider } from './useDialogProvider';

export type DialogTitleProps = {
  is?: any;
};

defineProps<DialogTitleProps>();

const { ids, dialogRef } = useDialogProvider('DialogTitle');

const handleDialogTitleLabelReference = () => {
  const $dialog = dialogRef.value;
  if (!$dialog) return;

  if ($dialog.hasAttribute('aria-label')) return;
  $dialog.setAttribute('aria-labelledby', ids.title);
};

onMounted(handleDialogTitleLabelReference);
</script>

<template>
  <component :is="is || 'span'" :id="ids.title" data-dialog-title>
    <slot />
  </component>
</template>
