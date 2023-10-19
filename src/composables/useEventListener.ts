import { MaybeRef, onUnmounted, toRef, onMounted } from 'vue';

export type EventListenerHandler = EventListenerOrEventListenerObject;

export type UnbindEventListenerHandler = () => void;

export function useEventListener<K extends keyof WindowEventMap>(
  target: Window,
  event: K,
  handler: (this: Window, ev: WindowEventMap[K]) => any,
  options?: EventListenerOptions | boolean,
): UnbindEventListenerHandler;
export function useEventListener<K extends keyof DocumentEventMap>(
  target: Document,
  event: K,
  handler: (this: Document, ev: DocumentEventMap[K]) => any,
  options?: EventListenerOptions | boolean,
): UnbindEventListenerHandler;
export function useEventListener<
  TElement extends HTMLElement,
  K extends keyof HTMLElementEventMap,
>(
  target: MaybeRef<TElement | null>,
  event: K,
  handler: (this: TElement, ev: HTMLElementEventMap[K]) => any,
  options?: EventListenerOptions | boolean,
): UnbindEventListenerHandler;
export function useEventListener(
  target: MaybeRef<Element | null> | Window | Document,
  event: string,
  handler: EventListenerHandler,
  options?: EventListenerOptions | boolean,
): UnbindEventListenerHandler {
  const $element = toRef(target);

  const bind = () => {
    if (!$element.value) return;
    $element.value.addEventListener(event, handler, options);
  };

  const unbind = () => {
    if (!$element.value) return;
    $element.value.removeEventListener(event, handler, options);
  };

  onMounted(bind);

  onUnmounted(unbind);

  return unbind;
}
