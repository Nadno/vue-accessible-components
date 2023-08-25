<script setup lang="ts">
import { ref } from 'vue';

import {
  DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@/components/DropdownMenu';

const MENU_ITEMS = {
  first: 'Item 1',
  second: 'Item 2',
  third: 'Item 3',
  fourth: 'Item 4',
  fifth: 'Item 5',
  sixth: 'Item 6',
  seventh: 'Item 7',
  eighth: 'Item 8',
  ninth: 'Item 9',
  tenth: 'Item 10',
};

const selectedItem = ref<keyof typeof MENU_ITEMS>('second');
</script>

<template>
  <div class="dropdown-menu-layout">
    <dropdown-menu-root>
      <dropdown-menu-trigger class="dropdown-menu-trigger">
        {{ MENU_ITEMS[selectedItem] }}
      </dropdown-menu-trigger>

      <dropdown-menu-portal>
        <dropdown-menu-content
          container-class="dropdown-menu-container"
          class="dropdown-menu"
          side="bottom"
          align="center"
          :offset="[0, 16]"
          loop
        >
          <dropdown-menu-item
            v-model="selectedItem"
            v-for="(label, key) in MENU_ITEMS"
            class="item"
            :disabled="['first', 'sixth', 'tenth'].includes(key)"
            :key="key"
            :value="key"
          >
            {{ label }}
          </dropdown-menu-item>

          <dropdown-menu-item class="item" disabled>
            Non item 1
          </dropdown-menu-item>

          <dropdown-menu-separator class="separator" />

          <dropdown-menu-item class="item" disabled>
            Non item 2
          </dropdown-menu-item>

          <dropdown-menu-separator class="separator" />

          <dropdown-menu-item class="item" disabled>
            Non item 3
          </dropdown-menu-item>
        </dropdown-menu-content>
      </dropdown-menu-portal>
    </dropdown-menu-root>
  </div>
</template>

<style scoped lang="scss">
.dropdown-menu-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
  margin-bottom: 32px;
}

.dropdown-menu-trigger {
  cursor: pointer;
  appearance: none;

  display: inline-block;
  padding: 8px;
  border-radius: 4px;

  border: none;
  background-color: #fff;

  text-transform: uppercase;
}

.dropdown-menu-container {
  width: 100%;
  max-width: 250px;
  min-height: 300px;
  max-height: 100vh;
  
  & :deep(.dropdown-menu) {
    width: 100%;
    min-height: inherit;
    max-height: inherit;
    display: flex;
    flex-direction: column;

    overflow-y: auto;
    scrollbar-width: thin;
    padding: 4px;
    border-radius: 4px;
    background-color: lighten(#111, 10%);

    opacity: 0;
    transform: translateY(-16px);

    &[data-state='open'] {
      opacity: 1;
      transform: translateY(0px);
      transition: transform 400ms ease, opacity 200ms ease;
    }

    .item + .item {
      margin-top: 2px;
    }

    .item {
      appearance: none;

      display: inline-block;
      padding: 8px;

      border: none;
      border-radius: 4px;
      color: whitesmoke;
      background-color: lighten(#111, 10%);

      text-transform: uppercase;

      &:focus:not([data-disabled='true']),
      &:hover:not([data-disabled='true']) {
        cursor: pointer;
        background-color: #111;
        outline: none;
      }

      &[data-disabled='true'] {
        opacity: 0.5;
        pointer-events: none;
      }
    }

    .separator {
      width: 100%;
      height: 1px;
      background-color: lighten(#111, 25%);
    }
  }
}
</style>
