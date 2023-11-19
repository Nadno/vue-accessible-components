import { inject, onBeforeUnmount, onBeforeMount } from 'vue';

import {
  DROPDOWN_MENU_CHECKBOX_GROUP_PROVIDER_NAME,
  CheckboxGroupProvider,
} from './DropdownMenuCheckboxGroup.vue';

export const DROPDOWN_MENU_ITEM_CHECKBOX_NAME = 'DropdownMenuItemCheckbox';

export const useDropdownMenuCheckboxGroup = (
  name: string,
  initialValue?: boolean,
): CheckboxGroupProvider => {
  const group = inject<CheckboxGroupProvider>(
    DROPDOWN_MENU_CHECKBOX_GROUP_PROVIDER_NAME,
  );
  if (!group)
    throw new Error(
      `You can only use a ${DROPDOWN_MENU_ITEM_CHECKBOX_NAME} within a DropdownMenuCheckboxGroup.`,
    );

  const registerButton = () => {
    if (!name) return;
    if (typeof name !== 'string')
      throw new TypeError(
        `The ${DROPDOWN_MENU_ITEM_CHECKBOX_NAME} name must be an string!`,
      );

    group.register(name, !!initialValue);
  };

  onBeforeMount(registerButton);

  const unregisterButton = () => group.unregister(name);

  onBeforeUnmount(unregisterButton);

  return group;
};
