import { inject, onBeforeUnmount, onBeforeMount } from 'vue';
import {
  TOGGLE_BUTTON_GROUP_PROVIDER_NAME,
  ToggleButtonGroupProvider,
} from './ToggleButtonGroup.vue';
import { useNullableRef } from '@/composables';

export const useToggleButtonGroupProvider = (
  name: string,
  initialValue?: boolean,
): ToggleButtonGroupProvider | undefined => {
  const group = inject<ToggleButtonGroupProvider>(
    TOGGLE_BUTTON_GROUP_PROVIDER_NAME,
  );

  const withGroup = useNullableRef<ToggleButtonGroupProvider>(group);

  const registerButton = () =>
    withGroup((group) => group.register(name as string, !!initialValue));

    onBeforeMount(registerButton);

  const unregisterButton = () =>
    withGroup((group) => group.unregister(name as string));

  onBeforeUnmount(unregisterButton);

  return group;
};
