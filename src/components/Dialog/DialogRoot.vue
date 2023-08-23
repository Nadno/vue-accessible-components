<script lang="ts">
export const DIALOG_PROVIDER_NAME = 'dialog-component-provider';
</script>

<script setup lang="ts">
import { reactive, provide, ref, Ref } from 'vue';

import { RefSetter, refSetter } from '@/components/utils';
import { useId } from '@/composables';

export type DialogRootProps = {
  id?: string;
};

export type DialogRootProvider = {
  dialogRef: Ref<HTMLElement | null>;
  setDialogRef: RefSetter;

  triggerRef: Ref<HTMLElement | null>;
  setTriggerRef: RefSetter;

  ids: {
    title: string;
    content: string;
  };
  state: { open: boolean };
  refs: Record<string, HTMLElement>;

  open: () => boolean;
  close: () => boolean;
  toggle: () => boolean;
};

const props = defineProps<DialogRootProps>();

const state = reactive({
  open: false,
});

const dialogRef = ref<HTMLElement | null>(null),
  triggerRef = ref<HTMLElement | null>(null);

const open = () => (state.open = true),
  close = () => (state.open = false),
  toggle = () => (state.open ? close() : open(), state.open);

const refs = reactive<Record<string, HTMLElement>>({});

const id = useId(props.id);

provide<DialogRootProvider>(DIALOG_PROVIDER_NAME, {
  dialogRef,
  setDialogRef: refSetter(dialogRef),
  triggerRef,
  setTriggerRef: refSetter(triggerRef),
  ids: {
    title: `dialog-title-${id}`,
    content: `dialog-content-${id}`,
  },
  state,
  refs,
  open,
  close,
  toggle,
});
</script>

<template>
  <slot />
</template>
