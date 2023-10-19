import { useAttrs } from 'vue';

export const mergeAriaAttributeValue = (
  current: Record<string, any>,
  incoming: Record<string, any>,
  key: string,
) => {
  const value = incoming[key];
  if (!Object.hasOwn(current, key)) {
    return value;
  }

  const currentValue = current[key];

  if (currentValue && currentValue.includes(value)) return currentValue;
  if (currentValue != null && value == null) return currentValue;

  return currentValue ? currentValue + ' ' + value : value;
};

export const useMergedAriaAttributes = (
  ...attributes: Record<string, any>[]
) => {
  const incomingAttributes = useAttrs();

  return attributes.reduce(
    (result, attrs) => {
      if (!attrs) return result;
      return Object.entries(attrs).reduce((result, [key, value]) => {
        if (!value) return result;
        result[key] = mergeAriaAttributeValue(attrs, result, key);
        return result;
      }, result);
    },
    { ...incomingAttributes } as Record<string, any>,
  );
};
