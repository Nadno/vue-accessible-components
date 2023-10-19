import { MaybeRef } from 'vue';
import { useEventListener } from './useEventListener';
import { debounce } from 'lodash';
import { useNullableRef } from './useNullableRef';

export type HoverEnterHandler = (event: MouseEvent | TouchEvent) => any;

export type HoverOutHandler = (event: MouseEvent) => any;

export type HoverCancelHandler = (event: PointerEvent | TouchEvent) => any;

export type UseHoverElementOptions = {
  enterDelay?: number;
  outerDelay?: number;
  onHoverIn: HoverEnterHandler;
  onHoverOut: HoverOutHandler;
  onHoverCancel?: HoverCancelHandler;
};

export const DEFAULT_HOVER_ELEMENT_ENTER_DELAY = 300,
  DEFAULT_HOVER_ELEMENT_OUTER_DELAY = 200;

export const useHoverElement = (
  target: MaybeRef<HTMLElement | null>,
  {
    enterDelay = DEFAULT_HOVER_ELEMENT_ENTER_DELAY,
    outerDelay = DEFAULT_HOVER_ELEMENT_OUTER_DELAY,
    onHoverIn,
    onHoverOut,
    onHoverCancel,
  }: UseHoverElementOptions,
) => {
  const clearSelection = () => window.getSelection()?.removeAllRanges();

  const withTarget = useNullableRef<HTMLElement>(target);

  const handleHoverEnter = debounce<HoverEnterHandler>((e) => {
    e.preventDefault();
    onHoverIn(e);
    clearSelection();
    if (e.type.startsWith('touch'))
      withTarget(($target) => ($target.dataset.hoverByTouch = 'touching'));
    withTarget(($target) => ($target.dataset.hover = 'enter'));
  }, enterDelay);

  const handleHoverCancel: HoverCancelHandler = (e) => {
    withTarget(($target) => ($target.dataset.hover = 'out'));
    handleHoverEnter.cancel();
    onHoverCancel && onHoverCancel(e);
  };

  const handleHoverOut = debounce<HoverOutHandler>((e) => {
    handleHoverEnter.cancel();
    onHoverOut(e);
    withTarget(($target) => ($target.dataset.hover = 'out'));
  }, outerDelay);

  const handlePreventClick = (e: MouseEvent) => {
    withTarget(($target) => {
      if (!$target.matches('[data-hover-by-touch="touching"]')) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      delete $target.dataset.hoverByTouch;
    });
  };

  const unbindPreventClick = useEventListener(
    target,
    'click',
    handlePreventClick,
    { capture: true },
  );

  const unbindTouchStart = useEventListener(
    target,
    'touchstart',
    (e) => (handleHoverOut.cancel(), handleHoverEnter(e)),
  );

  const unbindTouchEnd = useEventListener(
    target,
    'touchend',
    handleHoverCancel,
  );

  const unbindPointerCancel = useEventListener(
    target,
    'pointercancel',
    handleHoverCancel,
  );

  const unbindMouseOver = useEventListener(
    target,
    'mouseover',
    (e) => (handleHoverOut.cancel(), handleHoverEnter(e)),
  );

  const unbindMouseOut = useEventListener(target, 'mouseout', handleHoverOut);

  return () => {
    unbindPreventClick();
    unbindTouchStart();
    unbindTouchEnd();
    unbindPointerCancel();
    unbindMouseOver();
    unbindMouseOut();
  };
};
