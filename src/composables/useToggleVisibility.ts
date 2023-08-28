import { watch, MaybeRefOrGetter, toValue } from 'vue';

export type ToggleVisibilityHandler = (open: boolean) => void;

export const useToggleVisibility = (
  state: MaybeRefOrGetter<boolean>,
  onToggle: ToggleVisibilityHandler,
) => {
  const handleToggle = () =>
    requestAnimationFrame(() => onToggle(toValue(state)));

  watch(() => toValue(state), handleToggle, {
    flush: 'post',
  });
};
