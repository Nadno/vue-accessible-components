import { ref, onMounted, onUpdated, onUnmounted, MaybeRef, toValue } from 'vue';

import {
  createPopper,
  Instance as PopperInstance,
  Options,
} from '@popperjs/core';

import { useNullableRef } from './useNullableRef';

export type UsePopperOptions = Partial<Options>;

export const usePopper = (
  reference: MaybeRef<HTMLElement | null | undefined>,
  popper: MaybeRef<HTMLElement | null | undefined>,
  options: UsePopperOptions,
) => {
  const popperRef = ref<PopperInstance | null>(null);

  const withPopper = useNullableRef<PopperInstance>(popperRef);

  onMounted(() => {
    const $reference = toValue(reference),
      $popper = toValue(popper);

    if (!$reference || !$popper) return;

    popperRef.value = createPopper($reference, $popper, options);
  });

  const setOptions = (options: UsePopperOptions) =>
    withPopper((popper) => popper.setOptions(options));

  onUpdated(() => setOptions(options));

  onUnmounted(() => withPopper((popper) => popper.destroy()));

  const update = () => withPopper((popper) => popper.update());

  return { update, setOptions };
};
