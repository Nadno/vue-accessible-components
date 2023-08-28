import { Ref, MaybeRef, toValue } from 'vue';

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

export type WithRefValue<TValue, TReturn> = (value: TValue) => TReturn;

export type WithNullableRef = {
  <TValue, TReturn = undefined>(
    ref: MaybeRef<TValue | null | undefined>,
    callback: WithRefValue<TValue, TReturn>,
  ): TReturn | undefined;
  <TValue, TReturn = undefined>(
    ref: MaybeRef<TValue | null | undefined>,
    callback: WithRefValue<TValue, TReturn>,
    defaultValue: TReturn,
  ): TReturn;
};

export const withRef: WithNullableRef = <TValue, TReturn = undefined>(
  ref: MaybeRef<TValue | null | undefined>,
  useValue: (value: TValue) => TReturn | undefined,
  defaultValue?: TReturn,
): TReturn | undefined => {
  const value = toValue(ref);
  if (value == null) return defaultValue;
  return useValue(value);
};
