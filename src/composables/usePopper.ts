import {
  ref,
  watch,
  onMounted,
  onUpdated,
  onUnmounted,
  MaybeRef,
  toValue,
} from 'vue';

import {
  createPopper,
  Instance as PopperInstance,
  Options,
} from '@popperjs/core';

import { useNullableRef } from './useNullableRef';

export type UsePopperOptions = Partial<Options>;

export const usePopper = (
  referenceElement: MaybeRef<HTMLElement | null | undefined>,
  popperElement: MaybeRef<HTMLElement | null | undefined>,
  options: UsePopperOptions,
) => {
  const popperRef = ref<PopperInstance | null>(null);

  const withPopper = useNullableRef<PopperInstance>(popperRef);

  const create = () => {
    const $reference = toValue(referenceElement),
      $popper = toValue(popperElement);

    if (!$reference || !$popper) return;

    popperRef.value = createPopper($reference, $popper, options);
  };

  onMounted(create);

  const setOptions = (options: UsePopperOptions) =>
    withPopper((popper) => popper.setOptions(options));

  onUpdated(() => setOptions(options));

  const destroy = () => withPopper((popper) => popper.destroy());

  onUnmounted(destroy);

  const update = () => withPopper((popper) => popper.update());

  const handleElementRefChanges = () => {
    withPopper((popper) => {
      const $reference = toValue(referenceElement),
        $popper = toValue(popperElement);

      if (!$reference || !$popper) return;
      Object.assign(popper.state.elements, {
        popper: $popper,
        reference: $reference,
      });

      popper.update();
    });
  };

  watch([referenceElement, popperElement], handleElementRefChanges);

  const debugPopper = () => console.log('***POPPER_DEBUG', popperRef.value);

  return { update, setOptions, debugPopper };
};
