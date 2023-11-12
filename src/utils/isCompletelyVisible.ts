export const isCompletelyVisible = (
  $parent: Element,
  $child: HTMLElement,
): boolean => {
  const parent = $parent.getBoundingClientRect();
  const child = $child.getBoundingClientRect();

  const isCompletelyVisibleOnHorizontal =
      child.left >= parent.left && child.right <= parent.right,
    isCompletelyVisibleOnVertical =
      child.top >= parent.top && child.bottom <= parent.bottom;

  return isCompletelyVisibleOnVertical && isCompletelyVisibleOnHorizontal;
};

export const isCompletelyVisibleOnVertical = (
  $parent: Element,
  $child: HTMLElement,
): boolean => {
  const parent = $parent.getBoundingClientRect();
  const child = $child.getBoundingClientRect();

  console.log('***AUTOCOMPLETE:', {
    parent: { top: parent.top, bottom: parent.bottom },
    child: { top: child.top, bottom: child.bottom },
  });

  /**
   * child.top -> current position of the element into the viewport screen
   * child.bottom (top + height) -> vertical end position of the element into the viewport screen
   *
   * thus:
   *
   * child.bottom >= parent.top = it is starting to being visible on parent top
   * child.bottom < parent.top = it is not visible above the parent
   *
   * child.top > parent.bottom = it is not visible below the parent
   * child.top <= parent.bottom = it is stating to being visible on parent bottom
   *
   * thus:
   *
   * child.top >= parent.top = it is completely visible on parent top
   * child.bottom <= parent.bottom = it is completely visible on bottom top
   *
   * thus:
   *
   * (
   *  child.top >= parent.top &&
   *  child.bottom <= parent.bottom
   * ) = it is completely visible on both sides, so none of the child sides
   *     are overflowing the parent element.
   */
  return child.top >= parent.top && child.bottom <= parent.bottom;
};

export const isCompletelyVisibleOnHorizontal = (
  $parent: Element,
  $child: HTMLElement,
): boolean => {
  const parent = $parent.getBoundingClientRect();
  const child = $child.getBoundingClientRect();

  return child.left >= parent.left && child.right <= parent.right;
};
