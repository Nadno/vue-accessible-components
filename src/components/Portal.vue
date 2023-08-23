<script setup lang="ts">
import { Teleport } from 'vue';

import { getOrCreateGlobalContainerElement } from './utils';

export type PortalProps = {
  target?: HTMLElement | string;
};

const { target } = defineProps<PortalProps>();

const container =
  target && typeof target === 'string'
    ? getOrCreateGlobalContainerElement(target)
    : target;
</script>

<template>
  <teleport :to="container">
    <slot />
  </teleport>
</template>
