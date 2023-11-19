import { MaybeRef, onMounted, watch, toValue, onUnmounted } from 'vue';

const ARIA_LABEL_BY_ATTRIBUTE = 'aria-labelledby',
  ARIA_DESCRIPTION_BY_ATTRIBUTE = 'aria-describedby';

const createAriaConnectionHook = (ariaProperty: string) => {
  return (targetId: string | string[], id: MaybeRef<string>) => {
    const targetsIds = Array.isArray(targetId) ? targetId : [targetId];

    const withEachTarget = (callback: ($target: HTMLElement) => void) => {
      targetsIds.forEach((id: string) => {
        const $target = document.getElementById(id);
        if (!$target) return;
        callback($target);
      });
    };

    const setProperty = (label: string) => {
      withEachTarget(($target) => {
        const attribute = $target.getAttribute(ariaProperty);
        const newValue = !attribute ? label : `${attribute} ${label}`;
        $target.setAttribute(ariaProperty, newValue);
      });
    };

    const removeProperty = (label: string) => {
      withEachTarget(($target) => {
        const attribute = $target.getAttribute(ariaProperty);
        if (!attribute) return;
        $target.setAttribute(ariaProperty, attribute.replace(label, '').trim());
      });
    };

    onMounted(() => setProperty(toValue(id)));

    watch(
      () => toValue(id),
      (newLabel, oldLabel) => {
        removeProperty(oldLabel);
        setProperty(newLabel);
      },
    );

    onUnmounted(() => removeProperty(toValue(id)));
  };
};

export const useLabelFor = createAriaConnectionHook(ARIA_LABEL_BY_ATTRIBUTE);

export const useDescriptionFor = createAriaConnectionHook(
  ARIA_DESCRIPTION_BY_ATTRIBUTE,
);
