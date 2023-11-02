import { reactive, ref, watch, Ref } from 'vue';

import { RefSetter, refSetter, withRef } from '@/components/utils';

import {
  UsePopperOptions,
  useId,
  usePopper,
  useToggleVisibility,
} from '@/composables';

export type PopoverContentSides = 'top' | 'bottom' | 'left' | 'right';
export type PopoverContentAligns = 'start' | 'end' | 'center';

export type PopoverPopperOptions = {
  side?: PopoverContentSides;
  align?: PopoverContentAligns;
  modifiers?: UsePopperOptions['modifiers'];
};

export type PopoverState = {
  open: boolean;
  options: UsePopperOptions;
};

export type PopoverTypes = 'dialog' | 'grid' | 'listbox' | 'menu' | 'tree';

export type PopoverOptions<TState extends object> = {
  id?: string;
  state?: TState;
  type?: PopoverTypes;
};

export type PopoverData<TState extends object> = {
  id: string;
  triggerId: string;
  state: TState;
  type: PopoverTypes | 'true';
};

export type PopoverActions = {
  open: () => boolean;
  close: () => boolean;
  escape: () => void;
  toggle: () => boolean;
  setOptions: (options: PopoverPopperOptions) => void;
};

export type Popover<TState extends object> = PopoverData<TState> &
  PopoverActions & {
    setPopoverContainerRef: RefSetter;
    popoverContainerRef: Ref<HTMLElement | null>;
    setPopoverContentRef: RefSetter;
    popoverContentRef: Ref<HTMLElement | null>;
    setPopoverTriggerRef: RefSetter;
    popoverTriggerRef: Ref<HTMLElement | null>;
  };

export const usePopover = <TState extends object = {}>(
  options: PopoverOptions<TState & Partial<PopoverState>> = {},
): Popover<PopoverState & TState> => {
  const id = useId(options.id);

  const state = reactive<PopoverState>({
      open: false,
      options: {
        placement: 'bottom',
        strategy: 'fixed',
        modifiers: [
          {
            name: 'preventOverflow',
            options: {
              rootBoundary: 'document.body',
              altAxis: true,
            },
          },
        ],
      },
      ...options.state,
    }) as PopoverState & TState,
    popoverContainerRef = ref<HTMLElement | null>(null),
    popoverContentRef = ref<HTMLElement | null>(null),
    popoverTriggerRef = ref<HTMLElement | null>(null);

  const open = () => (state.open = true),
    close = () => (state.open = false),
    toggle = () => (state.open ? close() : open(), state.open);

  const escape = () => {
    close();
    const $trigger = popoverTriggerRef.value;
    $trigger && $trigger.focus();
  };

  const setOptions = (options: PopoverPopperOptions) => {
    const result = { ...state.options };

    if (options.modifiers)
      result.modifiers = [
        ...(state.options.modifiers || []),
        ...(options.modifiers || []),
      ];

    if (options.side) {
      const { side, align } = options;
      result.placement =
        !align || align === 'center' ? side : `${side}-${align}`;
    }

    state.options = result;
  };

  const popper = usePopper(
    popoverTriggerRef,
    popoverContainerRef,
    state.options,
  );

  watch(
    () => state.open,
    () => {
      if (!state.open) return;
      popper.setOptions(state.options);
      popper.update();
    },
  );

  useToggleVisibility(
    () => state.open,
    (open) => {
      const state = open ? 'open' : 'closed';

      withRef(
        popoverContainerRef,
        ($container) => ($container.dataset.state = state),
      );

      withRef(
        popoverContentRef,
        ($content) => ($content.dataset.state = state),
      );
    },
  );

  return {
    type: options.type || 'true',
    id: `${id}-content`,
    triggerId: `${id}-trigger`,
    state,
    open,
    close,
    escape,
    toggle,
    setOptions,
    setPopoverContainerRef: refSetter(popoverContainerRef),
    popoverContainerRef,
    setPopoverContentRef: refSetter(popoverContentRef),
    popoverContentRef,
    setPopoverTriggerRef: refSetter(popoverTriggerRef),
    popoverTriggerRef,
  };
};
