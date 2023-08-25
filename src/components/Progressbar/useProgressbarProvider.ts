import { inject } from 'vue';
import {
  PROGRESSBAR_PROVIDER_NAME,
  ProgressbarProvider,
} from './ProgressbarRoot.vue';

export const useProgressbarProvider = (
  name = 'useProgressbarProvider',
): ProgressbarProvider => {
  const provider = inject<ProgressbarProvider>(PROGRESSBAR_PROVIDER_NAME);
  if (!provider)
    throw new Error(
      `You should use "${name}" within a "ProgressbarRoot" only!`,
    );

  return provider;
};
