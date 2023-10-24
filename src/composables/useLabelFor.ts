import { MaybeRef, onMounted, watch, toValue, onUnmounted } from 'vue';

const ARIA_LABEL_BY_ATTRIBUTE = 'aria-labelledby';

export const useLabelFor = (targetId: string, labelId: MaybeRef<string>) => {
  const withTarget = (callback: ($target: HTMLElement) => void) => {
    const $target = document.getElementById(targetId);
    if (!$target) return;
    callback($target);
  };

  const setLabel = (label: string) => {
    withTarget(($target) => {
      const attribute = $target.getAttribute(ARIA_LABEL_BY_ATTRIBUTE);

      const newValue = !attribute ? label : `${attribute} ${label}`;

      $target.setAttribute(ARIA_LABEL_BY_ATTRIBUTE, newValue);
    });
  };

  const removeLabel = (label: string) => {
    withTarget(($target) => {
      const attribute = $target.getAttribute(ARIA_LABEL_BY_ATTRIBUTE);
      if (!attribute) return;

      $target.setAttribute(
        ARIA_LABEL_BY_ATTRIBUTE,
        attribute.replace(label, '').trim(),
      );
    });
  };

  onMounted(() => setLabel(toValue(labelId)));

  watch(
    () => toValue(labelId),
    (newLabel, oldLabel) => {
      removeLabel(oldLabel);
      setLabel(newLabel);
    },
  );

  onUnmounted(() => removeLabel(toValue(labelId)));
};
