<script setup lang="ts">
import DialogLayout from '@/layouts/Dialog.vue';
import DropdownMenuLayout from '@/layouts/DropdownMenu.vue';
import ProgressbarLayout from '@/layouts/Progressbar.vue';
import PopoverLayout from '@/layouts/Popover.vue';
import AutocompleteLayout from '@/layouts/Autocomplete.vue';
import ToggleButtonLayout from '@/layouts/ToggleButton.vue';
import SwitchLayout from '@/layouts/Switch.vue';
import RadioLayout from '@/layouts/Radio.vue';
import TabsLayout from '@/layouts/Tabs.vue';

import {
  TabRoot,
  TabList,
  TabItem,
  TabContent,
  TabPanel,
  TabTitle,
} from '@/components/Tab';

const handleCollapseLeave = (target: Element) => {
  const $target = target as HTMLElement;
  const rect = $target.getBoundingClientRect();

  Object.assign($target.style, {
    position: 'absolute',
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  });
};

const handleAfterCollapseLeave = (target: Element) => {
  const $target = target as HTMLElement;

  Object.assign($target.style, {
    position: '',
    width: '',
    height: '',
  });
};

const tabPanelTransitionProps = {
  duration: 500,
  enterFromClass: '-selecting',
  enterToClass: '-selected',
  leaveToClass: '-collapsing',
  onLeave: handleCollapseLeave,
  onAfterLeave: handleAfterCollapseLeave,
};
</script>

<template>
  <tab-root>
    <div class="tab-bar">
      <tab-title is="h1" class="title">Vue Accessible components</tab-title>

      <tab-list class="tab-list">
        <tab-item class="item" name="dialog-layout">Dialog</tab-item>
        <tab-item class="item" name="dropdown-menu-layout">
          Dropdown menu
        </tab-item>
        <tab-item class="item" name="popover-layout">Popover</tab-item>
        <tab-item class="item" name="progressbar-layout">Progressbar</tab-item>
        <tab-item class="item" name="autocomplete-layout">
          Autocomplete
        </tab-item>
        <tab-item class="item" name="toggle-button-layout">
          Toggle Button
        </tab-item>
        <tab-item class="item" name="switch-layout">Switch</tab-item>
        <tab-item class="item" name="radio-layout">Radio</tab-item>
        <tab-item class="item" name="tabs-layout">Tabs</tab-item>
      </tab-list>

      <tab-content
        class="tab-content"
        default-selected="dialog-layout"
        detach-on-collapse
      >
        <transition v-bind="tabPanelTransitionProps">
          <tab-panel class="panel" name="dialog-layout" prevent-focus>
            <dialog-layout />
          </tab-panel>
        </transition>

        <transition v-bind="tabPanelTransitionProps">
          <tab-panel class="panel" name="dropdown-menu-layout" prevent-focus>
            <dropdown-menu-layout />
          </tab-panel>
        </transition>

        <transition v-bind="tabPanelTransitionProps">
          <tab-panel class="panel" name="popover-layout" prevent-focus>
            <popover-layout />
          </tab-panel>
        </transition>

        <transition v-bind="tabPanelTransitionProps">
          <tab-panel class="panel" name="progressbar-layout">
            <progressbar-layout />
          </tab-panel>
        </transition>

        <transition v-bind="tabPanelTransitionProps">
          <tab-panel class="panel" name="autocomplete-layout" prevent-focus>
            <autocomplete-layout />
          </tab-panel>
        </transition>

        <transition v-bind="tabPanelTransitionProps">
          <tab-panel class="panel" name="toggle-button-layout" prevent-focus>
            <toggle-button-layout />
          </tab-panel>
        </transition>

        <transition v-bind="tabPanelTransitionProps">
          <tab-panel class="panel" name="switch-layout" prevent-focus>
            <switch-layout />
          </tab-panel>
        </transition>

        <transition v-bind="tabPanelTransitionProps">
          <tab-panel class="panel" name="radio-layout" prevent-focus>
            <radio-layout />
          </tab-panel>
        </transition>

        <transition v-bind="tabPanelTransitionProps">
          <tab-panel class="panel" name="tabs-layout" prevent-focus>
            <tabs-layout />
          </tab-panel>
        </transition>
      </tab-content>
    </div>
  </tab-root>
</template>

<style lang="scss">
.tab-bar {
  width: 100%;
  height: 100%;
  max-width: 1000px;
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  margin-right: auto;
  margin-left: auto;

  & > .title {
    font-size: 1.8rem;
    margin-bottom: 16px;
  }
}

.tab-list {
  width: 100%;
  display: flex;

  & > .item {
    cursor: pointer;
    appearance: none;

    display: inline-block;
    padding: 0.8em 1.6em;

    border: none;
    color: white;
    background-color: #303030;

    text-transform: uppercase;
    font-weight: bold;

    flex-grow: 1;

    &[data-selected] {
      background-color: #fff;
      color: #303030;
    }
  }
}

.tab-content {
  position: relative;
  overflow: hidden;
  height: 100%;
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  border: 1px solid #303030;

  & > .panel {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 100px;

    overflow-y: auto;
    padding: 48px 8px;
    flex-grow: 1;

    opacity: 1;
    transform: translateX(0);
    transition: opacity 500ms ease-in, transform 500ms ease-in;

    &.-selecting {
      opacity: 0;
      transform: translateX(-100%);
    }

    &.-collapsing {
      z-index: 1;
      opacity: 0;
      transform: translateX(100%);
    }
  }
}
</style>
