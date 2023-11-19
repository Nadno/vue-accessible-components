import { inject, onBeforeUnmount, onBeforeMount } from 'vue';

import {
  DROPDOWN_MENU_RADIO_GROUP_PROVIDER_NAME,
  RadioGroupProvider,
} from './DropdownMenuRadioGroup.vue';

export const DROPDOWN_MENU_ITEM_RADIO_NAME = 'DropdownMenuItemRadio';

export const useDropdownMenuRadioGroup = (
  name: string,
  initialValue?: boolean,
): RadioGroupProvider => {
  const group = inject<RadioGroupProvider>(
    DROPDOWN_MENU_RADIO_GROUP_PROVIDER_NAME,
  );
  if (!group)
    throw new Error(
      `You can only use a ${DROPDOWN_MENU_ITEM_RADIO_NAME} within a DropdownMenuRadioGroup.`,
    );

  const registerButton = () => {
    if (!name) return;
    if (typeof name !== 'string')
      throw new TypeError(
        `The ${DROPDOWN_MENU_ITEM_RADIO_NAME} name must be an string!`,
      );

    group.register(name, !!initialValue);
  };

  onBeforeMount(registerButton);

  const unregisterButton = () => group.unregister(name);

  onBeforeUnmount(unregisterButton);

  return group;
};
