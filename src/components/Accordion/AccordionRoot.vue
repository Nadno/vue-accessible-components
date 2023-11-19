<script lang="ts">
export const ACCORDION_PROVIDER_NAME = 'accordion-provider';

const MISSING_ACCORDION_ELEMENT_NAME_ERROR_MESSAGE =
  'The AccordionHeader or AccordionPanel must have a name!';
</script>

<script lang="ts" setup>
import {
  CheckGroupOptions,
  useCheckGroup,
  useKeyboardArrowFocus,
  useNullableRef,
} from '@/composables';
import { Ref, computed, provide, ref, watch } from 'vue';

export type AccordionElementTypes = 'heading' | 'trigger' | 'panel';

export type GetAccordionTitleHandler = (
  name: string,
  type: AccordionElementTypes,
  id?: string,
) => string;

export type AccordionProvider = {
  options: Ref<AccordionOptions>;
  accordions: Record<string, boolean>;
  register(name: string, opened: boolean): void;
  unregister(name: string): void;
  open(name: string): void;
  close(name: string): void;
  toggle(name: string, force?: boolean): boolean;
  isOpened(name: string): boolean;
  getAccordionTitle: GetAccordionTitleHandler;
};

export type AccordionOptions = {
  loop?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  detachOnHide?: boolean;
  avoidAllPanelsClosed?: boolean;
  defaultOpened?: string;
};

export type AccordionRootProps = {
  is?: any;
  id?: string;
  getAccordionTitle?: GetAccordionTitleHandler;
} & AccordionOptions;

const props = withDefaults(defineProps<AccordionRootProps>(), {
  loop: false,
  disabled: false,
  multiple: true,
  detachOnHide: false,
  avoidAllPanelsClosed: false,
  getAccordionTitle: undefined,
  defaultOpened: undefined,
});

const getAccordionTitle: GetAccordionTitleHandler = (name, type) => {
  if (props.getAccordionTitle)
    return props.getAccordionTitle(name, type, props.id);

  return props.id
    ? `accordion-[${props.id}]-[${name}]-${type}`
    : `accordion-[${props.id}]-[${name}]-${type}`;
};

const options = computed<AccordionOptions>(() => ({
  loop: props.loop,
  detachOnHide: props.detachOnHide,
  avoidAllPanelsClosed: props.avoidAllPanelsClosed,
  multiple: props.multiple,
  defaultOpened: props.defaultOpened,
  disabled: props.disabled,
}));

const accordionRoot = ref<HTMLElement | null>(null);

const getGroupOptions = (): CheckGroupOptions => ({
  disabled: options.value.disabled,
  allowAllUnchecked: !options.value.avoidAllPanelsClosed,
  multiple: options.value.multiple,
  defaultChecked: options.value.defaultOpened,
});

const group = useCheckGroup(getGroupOptions(), {
  missingNameOnRegister: MISSING_ACCORDION_ELEMENT_NAME_ERROR_MESSAGE,
  registeredChecker: 'The Accordion name "{{name}}" has already been used!',
});

const withRoot = useNullableRef<HTMLElement>(accordionRoot);

const setUseKeyboardArrowFocusState = useKeyboardArrowFocus({
  componentName: 'AccordionRoot',
  container: accordionRoot,
  target: '[data-accordion-trigger]',
  orientation: 'vertical',
  allowTabFocusing: false,
  loop: props.loop,
  useHoverIndex: false,
});

const updateGroupOptions = () => Object.assign(group.state, getGroupOptions());

watch(props, updateGroupOptions);

const updateKeyboardArrowFocusState = () =>
  setUseKeyboardArrowFocusState({
    loop: options.value.loop,
  });

watch(() => props.loop, updateKeyboardArrowFocusState);

const register = (name: string, opened: boolean) =>
  group.register(name, opened);

const unregister = (name: string) => group.unregister(name);

const open = (name: string): void => {
  group.state.checkers[name] = true;
  group.preventMultipleChecked(name);
};

const close = (name: string): void => {
  group.state.checkers[name] = false;
  group.preventAllUnchecked(name);
};

const isOpened = (name: string): boolean => group.isChecked(name);

const toggle = (name: string, force?: boolean): boolean => {
  const result = force == null ? !isOpened(name) : !!force;
  result ? open(name) : close(name);
  return result;
};

provide(ACCORDION_PROVIDER_NAME, {
  options,
  accordions: group.state.checkers,
  register,
  unregister,
  open,
  close,
  toggle,
  isOpened,
  getAccordionTitle,
});

const goToHeadingAt = (at: 'begin' | 'end') => {
  withRoot(($root) => {
    const positionSelector =
      at === 'begin' ? ':first-of-type' : ':last-of-type';
    const $trigger = $root.querySelector<HTMLElement>(
      `[data-accordion-section]${positionSelector} [data-accordion-trigger]`,
    );

    $trigger?.focus();
  });
};
</script>

<template>
  <component
    ref="accordionRoot"
    data-accordion-root
    role="group"
    :is="is || 'div'"
    :data-multiple="options.multiple || undefined"
    :data-disabled="options.disabled || undefined"
    :data-avoid-all-closed="options.avoidAllPanelsClosed || undefined"
    @keydown.home="goToHeadingAt('begin')"
    @keydown.end="goToHeadingAt('end')"
  >
    <slot />
  </component>
</template>
