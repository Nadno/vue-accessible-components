import { inject } from 'vue';
import {
  DROPDOWN_MENU_PROVIDER_NAME,
  DropdownMenuProvider,
} from './DropdownMenuRoot.vue';

export const useDropdownMenuProvider = (
  name = 'useDropdownMenuProvider',
): DropdownMenuProvider => {
  const dialogProvider = inject<DropdownMenuProvider>(
    DROPDOWN_MENU_PROVIDER_NAME,
  );
  if (!dialogProvider)
    throw new Error(`You should use "${name}" within a "DialogRoot" only!`);

  return dialogProvider;
};
