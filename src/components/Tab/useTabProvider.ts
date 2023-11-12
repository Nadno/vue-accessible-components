import { inject } from 'vue';

import { TAB_PROVIDER_NAME, TabProvider } from './TabRoot.vue';

export const useTabProvider = (name = 'useTabProvider'): TabProvider => {
  const provider = inject<TabProvider>(TAB_PROVIDER_NAME);

  if (!provider)
    throw new Error(
      `You should use "${name}" within a "DropdownMenuRoot" only!`,
    );

  return provider;
};
