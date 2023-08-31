<script setup lang="ts">
import { onMounted, watch } from 'vue';

import { PopoverContentAligns, PopoverContentSides, useInteractOutside, useNullableRef } from '@/composables';
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
  MENU_ITEM_NO_AUTOCLOSE_SELECTOR = '[data-autoclose="false"]';

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

const isVertical = props.orientation === 'vertical',
  isHorizontal = props.orientation === 'horizontal';

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
      .forEach(
        ($separator) =>
          !$separator.hasAttribute('aria-orientation') &&
          $separator.setAttribute(
            'aria-orientation',
            isVertical ? 'horizontal' : 'vertical',
          ),
      ),
  );

onMounted(handleSeparatorsOrientation);

const getDropdownMenuItem = (
  target: string | number | HTMLElement,
): HTMLElement | null => {
  const isString = typeof target === 'string',
    isIndex = typeof target === 'number';

  return withContent(($menu) => {
    if (!isString && !isIndex) return target;
    if (isIndex) return $menu.children[target] as HTMLElement;

    const $children = $menu.children,
      length = $children.length,
      isFirst = target === 'first',
      nextIndexValue = isFirst ? 1 : -1;

    let result: HTMLElement | null = null;

    for (
      let index = isFirst ? 0 : length - 1;
      isFirst ? index < length : index > 0;
      index += nextIndexValue
    ) {
      if (
        $children[index].matches(
          `${MENU_ITEM_SELECTOR}:not(${MENU_ITEM_DISABLED_SELECTOR})`,
        )
      ) {
        result = $children[index] as HTMLElement;
        break;
      }
    }

    return result;
  }, null);
};

const focusFirstDropdownItem = () => {
  const $firstItem = getDropdownMenuItem('first');
  if (!$firstItem) return;

  $firstItem.setAttribute('tabindex', '0');
  $firstItem.focus();
};

const unfocusFocusedDropdownItem = () => {
  const focusedItemSelector = '[tabindex="0"]';
  const $firstItem = getDropdownMenuItem('first');

  if (!$firstItem || $firstItem.matches(focusedItemSelector)) return;

  const $focusedItem = withContent(
    ($menu) => $menu.querySelector<HTMLElement>(focusedItemSelector),
    null,
  );

  $firstItem.setAttribute('tabindex', '0');

  if ($focusedItem) $focusedItem.setAttribute('tabindex', '-1');
};

const handleToggleDropdown = () => {
  requestAnimationFrame(() =>
    state.open ? focusFirstDropdownItem() : unfocusFocusedDropdownItem(),
  );
};

watch(() => state.open, handleToggleDropdown, {
  flush: 'post',
});

const getDropdownMenuItemSibling = (
  position: 'next' | 'previous',
  targetOrIndex: HTMLElement | number,
): HTMLElement | null => {
  const isIndex = typeof targetOrIndex === 'number';

  const $root = isIndex
    ? getDropdownMenuItem(targetOrIndex)
    : targetOrIndex.closest<HTMLElement>(MENU_ITEM_SELECTOR);

  if (!$root) return null;

  return ($root?.[`${position}ElementSibling`] as HTMLElement) || null;
};

const changeFocus = ($from: HTMLElement, $to?: HTMLElement | null): void => {
  if (!$to) return;

  $from.setAttribute('tabindex', '-1');
  $to.setAttribute('tabindex', '0');
  $to.focus();
};

const focusDropdownMenuItemSibling = (
  position: 'next' | 'previous',
  targetOrIndex: HTMLElement | number,
): boolean => {
  const $target = getDropdownMenuItem(targetOrIndex);
  if (!$target) return false;

  const $next = getDropdownMenuItemSibling(position, $target);
  if (!$next) return false;

  if (
    !$next.matches(MENU_ITEM_SELECTOR) ||
    $next.matches(MENU_ITEM_DISABLED_SELECTOR)
  ) {
    const hasFocused = focusDropdownMenuItemSibling(position, $next);
    if (hasFocused) $target.setAttribute('tabindex', '-1');
    return hasFocused;
  }

  changeFocus($target, $next);

  return true;
};

const handleNextItem = (e: Event) => {
  const $target = e.target as HTMLElement;

  const hasFocused = focusDropdownMenuItemSibling('next', $target);
  if (props.loop && !hasFocused) {
    changeFocus($target, getDropdownMenuItem('first'));
    return;
  }
};

const handlePrevItem = (e: Event) => {
  const $target = e.target as HTMLElement;

  const hasFocused = focusDropdownMenuItemSibling('previous', $target);

  if (props.loop && !hasFocused) {
    changeFocus($target, getDropdownMenuItem('last'));
    return;
  }
};

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
      @focus="getDropdownMenuItem('first')?.focus()"
      @click="handleAutoClose"
      @keydown.escape="escapeDropdownMenu"
      @keydown.home.prevent="getDropdownMenuItem('first')?.focus()"
      @keydown.end.prevent="getDropdownMenuItem('last')?.focus()"
      @keydown.up.prevent="isVertical && handlePrevItem($event)"
      @keydown.left.prevent="isHorizontal && handlePrevItem($event)"
      @keydown.down.prevent="isVertical && handleNextItem($event)"
      @keydown.right.prevent="isHorizontal && handleNextItem($event)"
      role="menu"
      tabindex="-1"
      data-menu
      data-state="closed"
    >
      <slot />
    </div>
  </div>
</template>
