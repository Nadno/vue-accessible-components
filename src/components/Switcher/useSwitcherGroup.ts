import { inject, onBeforeUnmount, onMounted } from 'vue';

import { useNullableRef } from '@/composables';

import {
  SWITCH_GROUP_PROVIDER_NAME,
  SwitcherGroupProvider,
} from './SwitcherGroup.vue';

export const useSwitcherGroupProvider = (
  name: string,
  initialValue?: boolean,
): SwitcherGroupProvider | undefined => {
  const group = inject<SwitcherGroupProvider>(
    SWITCH_GROUP_PROVIDER_NAME,
  );

  const withGroup = useNullableRef<SwitcherGroupProvider>(group);

  const registerButton = () =>
    withGroup((group) => group.register(name, !!initialValue));

    onMounted(registerButton);

  const unregisterButton = () =>
    withGroup((group) => group.unregister(name));

  onBeforeUnmount(unregisterButton);

  return group;
};
