<script lang="ts" setup>
import Portal, { PortalProps } from '../Portal.vue';

export type DropdownMenuPortalProps = PortalProps;

defineProps<PortalProps>();
</script>

<template>
  <portal :target="target || 'popover-global-container'">
    <slot />
  </portal>
</template>
