import {
  MaybeRef,
  MaybeRefOrGetter,
  watchPostEffect,
  onUnmounted,
  toValue,
  toRef,
} from 'vue';

export type FocusOutsideHandler = (e: MouseEvent | FocusEvent) => void;

export const useFocusOutside = (
  state: MaybeRefOrGetter<boolean>,
  target: MaybeRef<HTMLElement | null>,
  handler: FocusOutsideHandler,
) => {
  const $element = toRef(target);

  const focusOutsideHandler: FocusOutsideHandler = (e) => {
    if (!$element.value) return;

    const $target = e.relatedTarget as HTMLElement | null;
    if (!$target || !$element.value.contains($target)) handler(e);
  };

  const bind = () => {
    if (!$element.value) return;
    $element.value.addEventListener('focusout', focusOutsideHandler);
  };

  const unbind = () => {
    if (!$element.value) return;
    $element.value.removeEventListener('focusout', focusOutsideHandler);
  };

  watchPostEffect(() => (toValue(state) ? bind() : unbind()));

  onUnmounted(unbind);

  return unbind;
};
