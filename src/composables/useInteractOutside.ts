import { MaybeRef, MaybeRefOrGetter } from 'vue';

import { useClickOutside } from './useClickOutside';
import { useFocusOutside } from './useFocusOutside';

export type InteractOutsideHandler = (e: MouseEvent | FocusEvent) => void;

export const useInteractOutside = (
  state: MaybeRefOrGetter<boolean>,
  target: MaybeRef<HTMLElement | null>,
  handler: InteractOutsideHandler,
) => {
  const unbindClickOutside = useClickOutside(state, target, handler);
  const unbindFocusOutside = useFocusOutside(state, target, handler);

  return () => {
    unbindClickOutside();
    unbindFocusOutside();
  };
};
