import { MaybeRef, toValue, onMounted, reactive, computed } from 'vue';
import { useEventListener } from './useEventListener';
import { omitBy } from 'lodash';

export type HTMLElementSelector = string;

export type KeyboardArrowFocusOrientations = 'horizontal' | 'vertical' | 'both';

export type KeyboardArrowFocusState = {
  orientation: KeyboardArrowFocusOrientations;
  loop: boolean;
  allowTabFocusing: boolean;
  useHoverIndex: boolean;
};

export type UseKeyboardArrowFocusOptions = {
  componentName?: string;
  container: MaybeRef<HTMLElement | null>;
  target: HTMLElementSelector;
  skip?: HTMLElementSelector;
  handleSibling?(sibling: HTMLElement): HTMLElement | null;
  handleTabindex?(container: HTMLElement): void;
} & Partial<KeyboardArrowFocusState>;

const HORIZONTAL_KEYS = ['ArrowRight', 'ArrowLeft'],
  VERTICAL_KEYS = ['ArrowUp', 'ArrowDown'],
  KEYS_TO_DIR_MAP = {
    ArrowRight: 'next',
    ArrowLeft: 'prev',
    ArrowUp: 'prev',
    ArrowDown: 'next',
  } as const;

const getElementSelector = ($target: HTMLElement) => {
  let result = '';

  if ($target.id) result += '#' + $target.id;

  const classNames = Array.from($target.classList);
  if (classNames.length) result += '.' + classNames.join('.');

  return result;
};

export const useKeyboardArrowFocus = ({
  componentName = 'useKeyboardArrowFocus',
  container,
  target,
  skip,
  orientation = 'horizontal',
  loop = false,
  allowTabFocusing = false,
  useHoverIndex = true,
  handleSibling,
  handleTabindex,
}: UseKeyboardArrowFocusOptions): ((
  state: Partial<KeyboardArrowFocusState>,
) => KeyboardArrowFocusState) => {
  const state = reactive<KeyboardArrowFocusState>({
    loop,
    allowTabFocusing,
    orientation,
    useHoverIndex,
  });

  const setKeyboardArrowFocusState = ({
    loop,
    allowTabFocusing,
    orientation,
  }: Partial<KeyboardArrowFocusState>) => {
    const newState = {
      ...state,
      ...omitBy(
        { loop, allowTabFocusing, orientation },
        (value) => value == null,
      ),
    };

    Object.assign(state, newState);

    return newState;
  };

  const directionKeys = computed(() => {
    const isBothDirection = state.orientation === 'both',
      isVerticalDirection = state.orientation === 'vertical';

    return isBothDirection
      ? [...VERTICAL_KEYS, ...HORIZONTAL_KEYS]
      : isVerticalDirection
      ? VERTICAL_KEYS
      : HORIZONTAL_KEYS;
  });

  const getDirectChild = ($container: HTMLElement, $target: HTMLElement) => {
    let $element: HTMLElement | null = $target,
      deepCount = 0;

    while ($element && $element.parentElement !== $container) {
      if (deepCount >= 7) {
        throw new Error(
          `The keyboard focus navigation event handler of ${componentName} ` +
            'could not find its direct child, and was not able to go to the next' +
            `hierarchy of descendants elements within the ${componentName}.`,
        );
      }

      $element = $element.parentElement;
      deepCount++;
    }

    return $element;
  };

  const focusSibling = ($prev: HTMLElement, direction: 'prev' | 'next') => {
    const siblingKey =
      direction === 'next'
        ? 'nextElementSibling'
        : ('previousElementSibling' as const);

    let $next = $prev[siblingKey] as HTMLElement | null;

    while (skip && $next && $next.matches(skip)) {
      $next = $next[siblingKey] as HTMLElement;
    }

    if (!$next) return;
    if (!$next.matches(target)) $next = $next.querySelector(target);

    if (!$next)
      throw new Error(
        `The target of keyboard focus handler "${target}" was not found within ${getElementSelector(
          $prev,
        )}.`,
      );

    if (handleSibling) $next = handleSibling($next);
    if (!$next)
      throw new Error('The handleSibling method did not return any element!');

    if (state.useHoverIndex) $next.setAttribute('tabindex', '0');
    $next.focus();
  };

  const getEdgeChild = (at: 'first' | 'last'): HTMLElement | null => {
    const $container = toValue(container);
    if (!$container) return null;

    let $child = (
      at === 'first'
        ? $container.firstElementChild
        : $container.lastElementChild
    ) as HTMLElement | null;

    if ($child && !$child.matches(target))
      return $child.querySelector<HTMLElement>(target);
    return $child;
  };

  const focusEdgeChild = (at: 'first' | 'last'): void => {
    const $child = getEdgeChild(at);
    if ($child) $child.focus();
    return;
  };

  const handleFocusByKeyboard = (e: KeyboardEvent) => {
    const $target = e.target as HTMLElement;
    if (!$target.matches(target)) return;

    const key = e.key,
      isArrowFocus = directionKeys.value.includes(key),
      isTabFocus = !isArrowFocus && state.allowTabFocusing && key === 'Tab',
      isLoopAllowed = !isTabFocus && state.loop;

    if (!isArrowFocus && !isTabFocus) return;

    const $container = toValue(container);
    if (!$container) return;

    const focusDirection = isArrowFocus
        ? KEYS_TO_DIR_MAP[key as keyof typeof KEYS_TO_DIR_MAP]
        : e.shiftKey
        ? 'prev'
        : 'next',
      isForward = focusDirection === 'next';

    if ($container === $target)
      return focusEdgeChild(isForward ? 'first' : 'last');

    const isDirectChild = $target.parentElement === $container,
      $targetContainer = isDirectChild
        ? $target
        : getDirectChild($container, $target);

    if (!$targetContainer) return;

    const notEdgeElementSelector = isForward
        ? ':not(:last-of-type)'
        : ':not(:first-of-type)',
      isNotEdgeElement = $targetContainer.matches(notEdgeElementSelector);

    if (isLoopAllowed || isNotEdgeElement) e.preventDefault();

    if (isNotEdgeElement || !isLoopAllowed)
      return focusSibling($targetContainer, focusDirection);

    if (!isForward && $targetContainer.matches(':first-of-type')) {
      focusEdgeChild('last');
      return;
    }

    if (isForward && $targetContainer.matches(':last-of-type')) {
      focusEdgeChild('first');
      return;
    }
  };

  useEventListener(container, 'keydown', handleFocusByKeyboard);

  const handleFocusout = (e: FocusEvent) => {
    if (!state.useHoverIndex) return;

    const $container = toValue(container);
    if (!$container) return;

    const $target = e.target as HTMLElement;
    $target.setAttribute('tabindex', '-1');

    if ($container.contains(e.relatedTarget as HTMLElement)) return;

    if (handleTabindex) return handleTabindex($container);

    const $first = getEdgeChild('first');
    if (!$first) return;
    $first.setAttribute('tabindex', '0');

    return;
  };

  useEventListener(container, 'focusout', handleFocusout);

  const makeFirstChildFocusable = () => {
    if (!state.useHoverIndex) return;
    if (handleTabindex) {
      const $container = toValue(container);
      return $container && handleTabindex($container);
    }

    const $first = getEdgeChild('first');
    if (!$first) return;
    $first.setAttribute('tabindex', '0');
  };

  onMounted(makeFirstChildFocusable);

  return setKeyboardArrowFocusState;
};
