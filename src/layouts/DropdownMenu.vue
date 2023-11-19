<script setup lang="ts">
import { computed, ref } from 'vue';

import {
  DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuIndicator,
  DropdownMenuCheckboxGroup,
  DropdownMenuItemCheckbox,
  DropdownMenuRadioGroup,
  DropdownMenuItemRadio,
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

const iconsSize = ref('size-large');

const iconsOptions = ref({
  'auto-arrange': false,
  'align-grid': false,
  'show-desk-icons': true,
});

const enabledIconsOptions = computed(() =>
  Object.entries(iconsOptions.value)
    .filter(([, checked]) => checked)
    .map(([name]) => name),
);
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

    <dropdown-menu-root>
      <dropdown-menu-trigger class="dropdown-menu-trigger">
        Windows Desk Options
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
          <dropdown-menu-label
            class="label"
            :html-for="['icons-size', 'icons-options']"
          >
            View
          </dropdown-menu-label>

          <dropdown-menu-radio-group
            v-model="iconsSize"
            class="radio-group group"
            id="icons-size"
          >
            <dropdown-menu-item-radio name="size-large" class="item -checkable">
              Large icons
            </dropdown-menu-item-radio>

            <dropdown-menu-item-radio
              name="size-medium"
              class="item -checkable"
            >
              Medium icons
            </dropdown-menu-item-radio>

            <dropdown-menu-item-radio name="size-small" class="item -checkable">
              Small icons
            </dropdown-menu-item-radio>
          </dropdown-menu-radio-group>

          <dropdown-menu-separator class="separator" />

          <dropdown-menu-checkbox-group
            v-model="iconsOptions"
            class="checkbox-group group"
            id="icons-options"
          >
            <dropdown-menu-item-checkbox
              name="auto-arrange"
              class="item -checkable"
            >
              Autoarrange icons
            </dropdown-menu-item-checkbox>

            <dropdown-menu-item-checkbox
              name="align-grid"
              class="item -checkable"
            >
              Align items to grid
            </dropdown-menu-item-checkbox>

            <dropdown-menu-item-checkbox
              name="show-desk-icons"
              class="item -checkable"
            >
              Show desktop icons
            </dropdown-menu-item-checkbox>
          </dropdown-menu-checkbox-group>

          <dropdown-menu-radio-group class="radio-group group" id="sort-by">
            <dropdown-menu-label html-for="sort-by" class="label">
              Sort by
            </dropdown-menu-label>

            <dropdown-menu-item-radio
              name="sortby-name"
              class="item -checkable"
            >
              Name
              <dropdown-menu-indicator class="indicator" />
            </dropdown-menu-item-radio>

            <dropdown-menu-item-radio
              name="sortby-type"
              class="item -checkable"
              disabled
            >
              Type
            </dropdown-menu-item-radio>

            <dropdown-menu-item-radio
              name="sortby-size"
              class="item -checkable"
            >
              Size
            </dropdown-menu-item-radio>
          </dropdown-menu-radio-group>

          <dropdown-menu-separator class="separator" />

          <dropdown-menu-item class="item">Refresh</dropdown-menu-item>

          <dropdown-menu-item class="item">Display settings</dropdown-menu-item>

          <dropdown-menu-item class="item">Personalize</dropdown-menu-item>

          <dropdown-menu-item class="item">
            Show more options
          </dropdown-menu-item>
        </dropdown-menu-content>
      </dropdown-menu-portal>
    </dropdown-menu-root>

    <div class="block">
      <p>Enabled icon options: {{ enabledIconsOptions.join('; ') }}</p>
      <p>Selected icon size: {{ iconsSize }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dropdown-menu-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  gap: 32px;
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
  min-height: 150px;
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

    .label {
      padding: 4px 16px;
      font-size: 12px;
      color: whitesmoke;
      background: #515151;
      border-radius: 2px;
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

    .group {
      display: flex;
      flex-direction: column;

      .label {
        margin-top: 4px;
      }

      .item.-checkable {
        padding-left: 16px;
      }
    }

    .radio-group {
      .item.-checkable {
        position: relative;

        &[data-checked='true']::after {
          content: '';

          position: absolute;
          width: 8px;
          height: 8px;

          background-color: #fff;
          border-radius: 50%;

          left: 8px;
          top: 50%;
          transform: translate(0, -50%);
        }
      }
    }

    .checkbox-group {
      .item.-checkable {
        position: relative;

        &[data-checked='true']::after {
          content: '✓';

          position: absolute;

          color: #fff;

          left: 8px;
          top: 50%;
          transform: translate(0, -50%);
        }
      }
    }
  }
}
</style>
