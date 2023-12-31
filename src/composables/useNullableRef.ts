import { withRef } from '@/components/utils';
import { MaybeRef } from 'vue';

export type UseRefValue<TValue, TReturn> = (value: TValue) => TReturn;

export type UseNullableRef<TValue> = {
  <TReturn = void>(callback: UseRefValue<TValue, TReturn>): TReturn | undefined;
  <TReturn = void>(
    callback: UseRefValue<TValue, TReturn>,
    defaultValue: TReturn,
  ): TReturn;
};

export const useNullableRef = <TValue>(
  ref: MaybeRef<any>,
): UseNullableRef<TValue> => {
  return <TReturn = void>(
    callback: UseRefValue<TValue, TReturn>,
    defaultValue?: TReturn,
  ) => withRef(ref, callback, defaultValue);
};
