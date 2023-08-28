import { inject } from 'vue';
import { POPOVER_PROVIDER_NAME, PopoverProvider } from './PopoverRoot.vue';

export const usePopoverProvider = (
  name = 'usePopoverProvider',
): PopoverProvider => {
  const provider = inject<PopoverProvider>(POPOVER_PROVIDER_NAME);
  if (!provider)
    throw new Error(`You should use "${name}" within a "PopoverRoot" only!`);

  return provider;
};
