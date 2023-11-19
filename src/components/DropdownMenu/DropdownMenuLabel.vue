<script lang="ts" setup>
import AriaLabel, { AriaLabelProps } from '../AriaLabel.vue';

export type DropdownMenuRadioGroupLabelProps = Partial<AriaLabelProps>;

defineProps<DropdownMenuRadioGroupLabelProps>();
</script>

<template>
  <aria-label
    v-if="htmlFor"
    v-bind="$props"
    :html-for="htmlFor"
    role="presentation"
    data-menu-label
  >
    <slot />
  </aria-label>

  <component
    v-else
    v-bind="$props"
    :is="is || 'span'"
    role="presentation"
    data-menu-label
  >
    <slot />
  </component>
</template>
