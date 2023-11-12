<script lang="ts" setup>
import { useKeyboardArrowFocus, useNullableRef } from '@/composables';

import { nextTick, ref, watch } from 'vue';

import { TabItemSelectEvent } from '.';
import { TabOrientations } from './TabRoot.vue';
import { useTabProvider } from './useTabProvider';
import { isCompletelyVisibleOnHorizontal } from '@/utils/isCompletelyVisible';

export type TabListProps = {
  title?: string;
  orientation?: TabOrientations;
  loop?: boolean;
  preventAutoActivation?: boolean;
};

export type TabListEvents = {
  (type: 'tabSelect', event: TabItemSelectEvent): void;
};

const props = defineProps<TabListProps>();
const emit = defineEmits<TabListEvents>();

const tabList = ref<HTMLElement | null>(null);

const withTablist = useNullableRef<HTMLElement>(tabList);

const { state } = useTabProvider('TabList');

const setKeyboardArrowOptions = useKeyboardArrowFocus({
  componentName: 'TabList',
  container: tabList,
  orientation: state.orientation,
  target: '[data-tab-item]',
  loop: props.loop,
  handleTabindex($container) {
    nextTick(() => {
      const $tab = $container.querySelector<HTMLElement>(
        '[data-selected="true"]',
      );

      if (!$tab) {
        const $first = $container.querySelector<HTMLElement>('[data-checked]');
        if ($first) $first.setAttribute('tabindex', '0');
        return;
      }

      $tab.setAttribute('tabindex', '0');
    });
  },
});

watch(props, () => setKeyboardArrowOptions(props));

const handleAutoActivation = (e: FocusEvent) => {
  if (props.preventAutoActivation) return;

  const $target = e.target as HTMLElement;
  if (!$target) return;

  if (Object.hasOwn($target.dataset, 'preventAutoActivation')) {
    delete $target.dataset.preventAutoActivation;
    return;
  }

  if ($target.dataset.name === state.selectedName) return;

  $target.click();
};

const handleTabItemVisibility = (e: FocusEvent) => {
  const $target = e.target as HTMLElement;
  if (!$target) return;

  const isCompletelyVisible = withTablist(
    ($tablist) => isCompletelyVisibleOnHorizontal($tablist, $target),
    false,
  );

  if (isCompletelyVisible) return;

  $target.scrollIntoView({
    block: 'nearest',
    inline: 'center',
  });
};

const handleFocusIn = (e: FocusEvent) => {
  handleAutoActivation(e);
  handleTabItemVisibility(e);
};

const handleGoToTab = (e: KeyboardEvent) => {
  withTablist(($tablist) => {
    const isToFirstTab = e.key === 'Home',
      tabItemSelector =
        '[data-tab-item]' + (isToFirstTab ? ':first-of-type' : ':last-of-type');

    const $tab = $tablist.querySelector<HTMLElement>(tabItemSelector);
    if (!$tab) return;
    $tab.focus();
  });
};

const handleSelectTab = (e: MouseEvent) => {
  const $target = e.target as HTMLElement;
  if (!$target.matches('[data-tab-item]')) return;

  const name = $target.dataset.name;
  if (!name || name === state.selectedName) return;

  const shouldPreventAutoActivation =
    !props.preventAutoActivation &&
    e.isTrusted &&
    !$target.matches('[data-selected]');

  /**
   * Prevent double clicking by focusing the button on user
   * interaction and auto activating the tab.
   */
  if (shouldPreventAutoActivation) $target.dataset.preventAutoActivation = '';

  emit('tabSelect', {
    event: e,
    selected: state.selectedName,
    selecting: name,
  });
};
</script>

<template>
  <div
    data-tab-list
    role="tablist"
    ref="tabList"
    tabindex="-1"
    :aria-label="title"
    :aria-labelledby="state.titleId"
    :aria-orientation="state.orientation"
    :data-orientation="state.orientation"
    :data-selected="state.selectedName"
    :data-loop="loop || undefined"
    :data-auto-activation="!preventAutoActivation || undefined"
    @click="handleSelectTab"
    @keydown.home="handleGoToTab"
    @keydown.end="handleGoToTab"
    @focusin="handleFocusIn"
  >
    <slot />
  </div>
</template>
