import { reactive } from 'vue';

export type RegisterHandler = (name: string, pressed: boolean) => void;

export type UnregisterHandler = (name: string) => void;

export type CheckGroupOptions = {
  disabled?: boolean;
  multiple?: boolean;
  defaultChecked?: string;
  allowAllUnchecked?: boolean;
};

export type CheckGroupErrorMessages = {
  registeredChecker: string;
  missingNameOnRegister: string;
};

export type CheckGroup = {
  state: CheckGroupOptions & {
    checkers: Record<string, boolean>;
  };
  register: RegisterHandler;
  unregister: UnregisterHandler;
  has(name: string): boolean;
  isChecked(name: string): boolean;
  preventMultipleChecked(newCheckedName: string): void;
  preventAllUnchecked(newUncheckedName: string): void;
};

export const useCheckGroup = (
  options: CheckGroupOptions,
  errors: CheckGroupErrorMessages,
): CheckGroup => {
  const checkers: Record<string, boolean> = reactive({});
  const state = reactive<CheckGroup['state']>({
    checkers,
    multiple: options.multiple,
    disabled: options.disabled,
    allowAllUnchecked: options.allowAllUnchecked,
    defaultChecked: options.defaultChecked,
  });

  const has = (name: string): boolean => Object.hasOwn(checkers, name);

  const isChecked = (name: string): boolean => checkers[name];

  const preventMultipleChecked = (newCheckedName: string) => {
    if (options.multiple) return;
    if (!isChecked(newCheckedName)) return;

    const currentPressed = Object.entries(checkers).find(
      ([currentName, currentPressed]) =>
        currentPressed && currentName !== newCheckedName,
    );

    if (!currentPressed) return;
    const [currentPressedName] = currentPressed;
    checkers[currentPressedName] = false;
  };

  const preventAllUnchecked = (newUncheckedName: string) => {
    if (options.allowAllUnchecked || !has(newUncheckedName)) return;
    if (isChecked(newUncheckedName)) return;

    const hasSomeChecked = Object.values(checkers).some((checked) => checked);
    if (hasSomeChecked) return;

    checkers[newUncheckedName] = true;
  };

  const register: RegisterHandler = (name, checked) => {
    if (!name) throw new Error(errors.missingNameOnRegister);
    if (has(name))
      throw new Error(errors.registeredChecker.replaceAll('{{name}}', name));

    const defaultCheckedName = state.defaultChecked;
    if (defaultCheckedName) checked = defaultCheckedName === name;

    checkers[name] = checked;

    if (checked) preventMultipleChecked(name);
    if (!checked && !defaultCheckedName) preventAllUnchecked(name);
  };

  const unregister: UnregisterHandler = (name) => {
    if (!name) throw new Error(errors.missingNameOnRegister);
    delete checkers[name];
  };

  return {
    state,
    register,
    unregister,
    has,
    isChecked,
    preventMultipleChecked,
    preventAllUnchecked,
  };
};
