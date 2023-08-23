import { inject } from 'vue';
import { DIALOG_PROVIDER_NAME, DialogRootProvider } from './DialogRoot.vue';

export const useDialogProvider = (
  name = 'useDialogProvider',
): DialogRootProvider => {
  const dialogProvider = inject<DialogRootProvider>(DIALOG_PROVIDER_NAME);
  if (!dialogProvider)
    throw new Error(`You should use "${name}" within a "DialogRoot" only!`);

  return dialogProvider;
};
