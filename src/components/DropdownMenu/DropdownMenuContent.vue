<script setup lang="ts">
import { onMounted, watch } from 'vue';

import {
  PopoverContentAligns,
  PopoverContentSides,
  useInteractOutside,
  useKeyboardArrowFocus,
  useNullableRef,
} from '@/composables';
import { useDropdownMenuProvider } from './useDropdownMenuProvider';

export type DropdownMenuContentSides = PopoverContentSides;
export type DropdownMenuContentAligns = PopoverContentAligns;
export type DropdownMenuContentOrientations = 'vertical' | 'horizontal';

export type DropdownMenuContentProps = {
  offset?: [number, number];
  side: DropdownMenuContentSides;
  align: DropdownMenuContentAligns;
  orientation?: DropdownMenuContentOrientations;
  loop?: boolean;
  label?: string;
  autoclose?: boolean;
  containerClass?: string | object;
};

const MENU_ITEM_SELECTOR = '[data-menu-item]',
  MENU_ITEM_DISABLED_SELECTOR = '[data-disabled="true"]',
  MENU_ITEM_NO_AUTOCLOSE_SELECTOR = '[data-autoclose="false"]',
  MENU_SEPARATOR_SELECTOR = '[data-separator]';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<DropdownMenuContentProps>(), {
  offset: () => [0, 0],
  side: 'bottom',
  align: 'center',
  loop: false,
  autoclose: true,
  orientation: 'vertical',
});

const {
  id,
  triggerId,
  state,
  close,
  setOptions,
  dropdownMenuTriggerRef,
  dropdownMenuContentRef,
  setDropdownMenuContentRef,
  setDropdownMenuContainerRef,
} = useDropdownMenuProvider('DropdownMenuContent');

setOptions({
  side: props.side,
  align: props.align,
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: props.offset,
      },
    },
  ],
});

const withContent = useNullableRef<HTMLElement>(dropdownMenuContentRef),
  withTrigger = useNullableRef<HTMLElement>(dropdownMenuTriggerRef);

const handleInteractOut = () => {
  /**
   * `setTimeout` avoids re-opening the dropdown menu when
   * clicking at its trigger.
   */
  setTimeout(() => {
    if (!state.open) return;
    close();
  }, 150);
};

useInteractOutside(() => state.open, dropdownMenuContentRef, handleInteractOut);

const handleSeparatorsOrientation = () =>
  withContent(($menu) =>
    $menu
      .querySelectorAll(':scope > [data-separator]')
      .forEach(($separator) =>
        $separator.setAttribute('aria-orientation', props.orientation),
      ),
  );

onMounted(handleSeparatorsOrientation);

watch(() => props.orientation, handleSeparatorsOrientation);

const getDropdownMenuItemAt = (at: 'begin' | 'end'): HTMLElement | null => {
  const atSelector = at === 'begin' ? 'first-of-type' : 'last-of-type';
  return withContent(
    ($content) =>
      $content.querySelector<HTMLElement>(
        `${MENU_ITEM_SELECTOR}:${atSelector}`,
      ),
    null,
  );
};

const handleToggleDropdown = () => {
  if (!state.open) return;

  const $first = getDropdownMenuItemAt('begin');
  if (!$first) return;

  requestAnimationFrame(() => $first.focus());
};

watch(() => state.open, handleToggleDropdown, {
  flush: 'post',
});

const setKeyboardArrowFocusState = useKeyboardArrowFocus({
  componentName: 'DropdownMenuContent',
  container: dropdownMenuContentRef,
  target: MENU_ITEM_SELECTOR,
  skip: MENU_SEPARATOR_SELECTOR,
  loop: props.loop,
  orientation: props.orientation,
});

watch(
  () => [props.orientation, props.loop],
  () =>
    setKeyboardArrowFocusState({
      orientation: props.orientation,
      loop: props.loop,
    }),
);

const escapeDropdownMenu = () => {
  close();
  withTrigger(($trigger) => $trigger.focus());
};

const handleAutoClose = (e: MouseEvent) => {
  if (!props.autoclose) return;

  const $target = e.target as HTMLElement;
  if (!$target || !$target.matches(MENU_ITEM_SELECTOR)) return;

  e.preventDefault();

  const isAutoclose =
    !$target.matches(MENU_ITEM_DISABLED_SELECTOR) &&
    !$target.matches(MENU_ITEM_NO_AUTOCLOSE_SELECTOR);
  if (isAutoclose) escapeDropdownMenu();
};
</script>

<template>
  <div
    v-show="state.open"
    :ref="setDropdownMenuContainerRef"
    :class="containerClass"
    :data-side="side"
    :data-align="align"
    :data-orientation="orientation"
    data-state="closed"
  >
    <div
      v-bind="$attrs"
      :id="id"
      :ref="setDropdownMenuContentRef"
      :aria-orientation="orientation"
      :aria-label="label"
      :aria-labelledby="!label ? triggerId : undefined"
      :data-side="side"
      :data-align="align"
      :data-orientation="orientation"
      :data-loop="loop"
      :data-autoclose="autoclose"
      @focus.self="getDropdownMenuItemAt('begin')?.focus()"
      @click="handleAutoClose"
      @keydown.escape="escapeDropdownMenu"
      @keydown.home.prevent="getDropdownMenuItemAt('begin')?.focus()"
      @keydown.end.prevent="getDropdownMenuItemAt('end')?.focus()"
      role="menu"
      tabindex="-1"
      data-menu
      data-state="closed"
    >
      <slot />
    </div>
  </div>
</template>
