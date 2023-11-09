import { Modifier, detectOverflow } from '@popperjs/core';

export const preventOverflowWithMaxHeight = (
  padding: number,
): Modifier<'preventOverflowWithMaxHeight', {}> => {
  return {
    enabled: true,
    name: 'preventOverflowWithMaxHeight',
    phase: 'main',
    requiresIfExists: ['offset'],
    fn: ({ state }) => {
      const placement = state.placement,
        isTopPlacement = placement.startsWith('top'),
        isBottomPlacement = !isTopPlacement && placement.startsWith('bottom');

      if (!isTopPlacement && !isBottomPlacement) return;

      const { styles, rects } = state;

      const overflow = detectOverflow(state);

      const isOverflowing = isTopPlacement
          ? overflow.top > 0
          : overflow.bottom > 0,
        hasFreeSpaceUnfilled = isTopPlacement
          ? overflow.top + padding < 0
          : overflow.bottom + padding < 0;

      if (!isOverflowing && !hasFreeSpaceUnfilled) return;

      const popperHeight = rects.popper.height,
        maxHeight =
          (isTopPlacement
            ? popperHeight - overflow.top
            : popperHeight - overflow.bottom) - padding;

      if (maxHeight < 0) return;

      return {
        ...state,
        styles: {
          ...styles,
          popper: {
            ...styles.popper,
            maxHeight: `${maxHeight}px`,
          },
        },
      };
    },
  };
};
