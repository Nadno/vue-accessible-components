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
  subcontainer?: HTMLElementSelector;
  target: HTMLElementSelector | HTMLElementSelector[];
  handleTabindex?(container: HTMLElement): void;
} & Partial<KeyboardArrowFocusState>;

export type FocusDirections = 'forward' | 'backward';

const HORIZONTAL_KEYS = ['ArrowRight', 'ArrowLeft'],
  VERTICAL_KEYS = ['ArrowUp', 'ArrowDown'],
  KEYS_TO_DIR_MAP = {
    ArrowRight: 'forward',
    ArrowLeft: 'backward',
    ArrowUp: 'backward',
    ArrowDown: 'forward',
  } as const;

export const useKeyboardArrowFocus = ({
  componentName = 'useKeyboardArrowFocus',
  container,
  subcontainer,
  target,
  orientation = 'horizontal',
  loop = false,
  allowTabFocusing = false,
  useHoverIndex = true,
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

  const targetSelector = Array.isArray(target) ? target.join(',') : target;

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

  const getContainerFrom = ($target: HTMLElement): HTMLElement | null => {
    let $result: HTMLElement | null = $target;

    const $container = toValue(container);
    if (!$container) return $result;
    if (!subcontainer) return $container;

    while (
      $result &&
      $result !== $container &&
      !$result.matches(subcontainer)
    ) {
      $result = $result.parentElement;
    }

    return $result;
  };

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

  const getSibling = (
    direction: FocusDirections,
    $target: HTMLElement,
  ): HTMLElement | null => {
    const targetOrSubcontainerSelector = subcontainer
        ? [targetSelector, subcontainer].join(',')
        : targetSelector,
      siblingKey =
        direction === 'forward'
          ? 'nextElementSibling'
          : 'previousElementSibling';

    let $current: HTMLElement | null = $target[siblingKey] as HTMLElement,
      $found: HTMLElement | null =
        $current &&
        ($current.matches(targetSelector)
          ? $current
          : $current.querySelector(targetSelector));

    while (
      $current &&
      (!$found || !$found.matches(targetOrSubcontainerSelector))
    ) {
      $current = $current[siblingKey] as HTMLElement;
      $found =
        $current &&
        ($current.matches(targetSelector)
          ? $current
          : $current.querySelector(targetSelector));
    }

    return $found;
  };

  const getEdgeChild = (
    $container: HTMLElement,
    at: 'first' | 'last',
  ): HTMLElement | null => {
    let $child = (
      at === 'first'
        ? $container.firstElementChild
        : $container.lastElementChild
    ) as HTMLElement | null;

    if ($child && !$child.matches(targetSelector))
      return getSibling(at === 'first' ? 'forward' : 'backward', $child);

    return $child;
  };

  const focusEdgeChild = (
    $container: HTMLElement,
    at: 'first' | 'last',
  ): void => {
    const $child = getEdgeChild($container, at);
    if ($child) $child.focus();
    return;
  };

  const handleFocusByKeyboard = (e: KeyboardEvent) => {
    const $target = e.target as HTMLElement;
    if (!$target.matches(targetSelector)) return;

    const key = e.key,
      isArrowFocus = directionKeys.value.includes(key),
      isTabFocus = !isArrowFocus && state.allowTabFocusing && key === 'Tab',
      isLoopAllowed = !isTabFocus && state.loop;

    if (!isArrowFocus && !isTabFocus) return;

    const $container = getContainerFrom($target);
    if (!$container) return;

    const focusDirection = isArrowFocus
        ? KEYS_TO_DIR_MAP[key as keyof typeof KEYS_TO_DIR_MAP]
        : e.shiftKey
        ? 'backward'
        : 'forward',
      isForward = focusDirection === 'forward';

    if ($container === $target)
      return focusEdgeChild($container, isForward ? 'first' : 'last');

    const isDirectChild = $target.parentElement === $container,
      $targetContainer = isDirectChild
        ? $target
        : getDirectChild($container, $target);

    if (!$targetContainer) return;

    const $sibling = getSibling(focusDirection, $targetContainer);

    if (isLoopAllowed || $sibling) e.preventDefault();

    if ($sibling) return $sibling.focus();
    if (!isLoopAllowed) return;

    if (!isForward && !$sibling) {
      if (subcontainer && $container.matches(subcontainer)) {
        const $outerNext = getSibling(focusDirection, $container);
        if ($outerNext) return $outerNext.focus();

        const $outerContainer = toValue(container);
        $outerContainer && focusEdgeChild($outerContainer, 'last');
        return;
      }

      focusEdgeChild($container, 'last');
      return;
    }

    if (isForward && !$sibling) {
      if (subcontainer && $container.matches(subcontainer)) {
        const $outerNext = getSibling(focusDirection, $container);
        if ($outerNext) return $outerNext.focus();

        const $outerContainer = toValue(container);
        $outerContainer && focusEdgeChild($outerContainer, 'first');
        return;
      }

      focusEdgeChild($container, 'first');
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

    const $first = getEdgeChild($container, 'first');
    if (!$first) return;
    $first.setAttribute('tabindex', '0');

    return;
  };

  useEventListener(container, 'focusout', handleFocusout);

  const makeFirstChildFocusable = () => {
    if (!state.useHoverIndex) return;

    const $container = toValue(container);
    if (!$container) return;

    if (handleTabindex) return $container && handleTabindex($container);

    const $first = getEdgeChild($container, 'first');
    if (!$first) return;

    $first.setAttribute('tabindex', '0');
  };

  onMounted(makeFirstChildFocusable);

  return setKeyboardArrowFocusState;
};
