import { Ref } from 'vue';

export const getOrCreateGlobalContainerElement = (
  id: string,
): HTMLDivElement => {
  const $found = document.getElementById(id) as HTMLDivElement;
  if ($found) return $found;

  const $container = document.createElement('div');

  $container.id = id;
  $container.dataset.popupContainer = '';

  document.body.append($container);

  return $container;
};

export type RefSetter = (ref: any) => void;

export type CreateRefSetter<TElement extends Element = Element> = (
  ref: Ref<TElement | null>,
) => RefSetter;

export const refSetter: CreateRefSetter<HTMLElement> = (ref) => (node) => {
  ref.value = node;
};
