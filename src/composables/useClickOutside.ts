import {
  MaybeRef,
  MaybeRefOrGetter,
  watchPostEffect,
  onUnmounted,
  toValue,
  toRef,
} from 'vue';

export type ClickOutsideHandler = (e: MouseEvent) => void;

export const useClickOutside = (
  state: MaybeRefOrGetter<boolean>,
  target: MaybeRef<HTMLElement | null>,
  handler: ClickOutsideHandler,
) => {
  const $element = toRef(target);

  const clickOutsideHandler: ClickOutsideHandler = (e) => {
    if (!$element.value) return;

    const $target = e.target as HTMLElement | null;
    if (!$target || !$element.value.contains($target)) handler(e);
  };

  const bind = () => {
    requestAnimationFrame(() => {
      /**
       * We add the listener in the next frame because
       * otherwise the event is fired right after being added.
       */
      if (!$element.value) return;
      window.addEventListener('pointerdown', clickOutsideHandler);
    });
  };

  const unbind = () => {
    if (!$element.value) return;
    window.removeEventListener('pointerdown', clickOutsideHandler);
  };

  watchPostEffect(() => (toValue(state) ? bind() : unbind()));

  onUnmounted(unbind);

  return unbind;
};
