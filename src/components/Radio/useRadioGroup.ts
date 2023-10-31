import { inject, onBeforeUnmount, onMounted } from 'vue';

import {
  RADIO_GROUP_PROVIDER_NAME,
  RadioGroupProvider,
} from './RadioGroup.vue';

export const useRadioGroupProvider = (
  name: string,
  initialValue?: boolean,
): RadioGroupProvider => {
  const group = inject<RadioGroupProvider>(RADIO_GROUP_PROVIDER_NAME);
  if (!group) throw new Error('You can only use a Radio within a RadioGroup.');

  const registerButton = () => group.register(name, !!initialValue);

  onMounted(registerButton);

  const unregisterButton = () => group.unregister(name);

  onBeforeUnmount(unregisterButton);

  return group;
};
