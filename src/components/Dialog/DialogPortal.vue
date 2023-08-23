<script lang="ts" setup>
import Portal, { PortalProps } from '../Portal.vue';

export type DialogPortalProps = PortalProps;

defineProps<PortalProps>();
</script>

<template>
  <portal :target="target || 'modal-global-container'">
    <slot />
  </portal>
</template>
