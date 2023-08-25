import { inject } from 'vue';
import {
  DROPDOWN_MENU_PROVIDER_NAME,
  DropdownMenuProvider,
} from './DropdownMenuRoot.vue';

export const useDropdownMenuProvider = (
  name = 'useDropdownMenuProvider',
): DropdownMenuProvider => {
  const provider = inject<DropdownMenuProvider>(
    DROPDOWN_MENU_PROVIDER_NAME,
  );
  if (!provider)
    throw new Error(`You should use "${name}" within a "DropdownMenuRoot" only!`);

  return provider;
};
