<script lang="ts">
export const POPOVER_PROVIDER_NAME = 'popover-provider';
</script>

<script setup lang="ts">
import { provide } from 'vue';

import {
  usePopover,
  Popover,
  PopoverState as DefaultPopoverState,
  PopoverTypes,
} from '@/composables';

export type PopoverState = DefaultPopoverState;

export type PopoverProvider = Popover;

export type PopoverRootProps = {
  id?: string;
  type?: PopoverTypes;
};

defineOptions({
  name: 'PopoverRoot',
});

const props = defineProps<PopoverRootProps>();
const popover = usePopover(props);

provide(POPOVER_PROVIDER_NAME, popover);
</script>

<template>
  <slot />
</template>
