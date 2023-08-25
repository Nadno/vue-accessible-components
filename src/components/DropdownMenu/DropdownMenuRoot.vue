<script lang="ts">
export const DROPDOWN_MENU_PROVIDER_NAME = 'dropdown-menu-provider';
</script>

<script setup lang="ts">
import { reactive, ref, provide, watch, Ref } from 'vue';

import { RefSetter, refSetter } from '@/components/utils';

import { UsePopperOptions, useId, usePopper } from '@/composables';

export type DropdownMenuState = {
  open: boolean;
  options: UsePopperOptions;
};

export type DropdownMenuProvider = {
  id: string;
  triggerId: string;
  state: DropdownMenuState;
  open: () => boolean;
  close: () => boolean;
  toggle: () => boolean;
  setOptions: (options: UsePopperOptions) => void;
  setDropdownMenuContainerRef: RefSetter;
  dropdownMenuContainerRef: Ref<HTMLElement | null>;
  setDropdownMenuContentRef: RefSetter;
  dropdownMenuContentRef: Ref<HTMLElement | null>;
  setDropdownMenuTriggerRef: RefSetter;
  dropdownMenuTriggerRef: Ref<HTMLElement | null>;
};

defineOptions({
  name: 'DropdownMenuRoot',
});

const props = defineProps({
  id: {
    req: false,
    type: String,
  },
});

const id = useId(props.id);

const state = reactive<DropdownMenuState>({
    open: false,
    options: {
      placement: 'bottom',
      strategy: 'fixed',
      modifiers: [
        {
          name: 'preventOverflow',
          options: {
            rootBoundary: 'document.body',
            altAxis: true,
          }
        }
      ],
    },
  }),
  dropdownMenuContentRef = ref<HTMLElement | null>(null),
  dropdownMenuTriggerRef = ref<HTMLElement | null>(null),
  dropdownMenuContainerRef = ref<HTMLElement | null>(null);

const open = () => (state.open = true),
  close = () => (state.open = false),
  toggle = () => (state.open ? close() : open(), state.open);

const setOptions = (options: UsePopperOptions) =>
  (state.options = {
    ...state.options,
    ...options,
    modifiers: [
      ...(state.options.modifiers || []),
      ...(options.modifiers || []),
    ],
  });

const popper = usePopper(
  dropdownMenuTriggerRef,
  dropdownMenuContainerRef,
  state.options,
);

watch(
  () => state.open,
  () => {
    if (!state.open) return;
    popper.setOptions(state.options);
    popper.update();
  },
);

provide(DROPDOWN_MENU_PROVIDER_NAME, {
  id: `${id}-content`,
  triggerId: `${id}-trigger`,
  state,
  open,
  close,
  toggle,
  setOptions,
  setDropdownMenuContainerRef: refSetter(dropdownMenuContainerRef),
  dropdownMenuContainerRef,
  setDropdownMenuContentRef: refSetter(dropdownMenuContentRef),
  dropdownMenuContentRef,
  setDropdownMenuTriggerRef: refSetter(dropdownMenuTriggerRef),
  dropdownMenuTriggerRef,
});
</script>

<template>
  <slot />
</template>
