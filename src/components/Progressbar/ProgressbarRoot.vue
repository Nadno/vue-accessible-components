<script lang="ts">
export const PROGRESSBAR_PROVIDER_NAME = 'progressbar-provider';
</script>

<script setup lang="ts">
import { computed, provide, ComputedRef } from 'vue';

export type ProgressbarStates = 'loading' | 'empty' | 'completed';

export type ProgressbarRanges = {
  min: number;
  max: number;
  value: number;
};

export type ProgressbarProvider = {
  percentage: ComputedRef<number>;
  percentageText: ComputedRef<string | undefined>;
  progressState: ComputedRef<ProgressbarStates>;
  indeterminate: boolean;
} & ProgressbarRanges;

export type ProgressbarProps = {
  min?: number;
  max?: number;
  value?: number;
  label: string;
  indeterminate?: boolean;
  valueText?: (
    range: ProgressbarRanges,
    indeterminate: boolean,
  ) => string | undefined;
};

const props = withDefaults(defineProps<ProgressbarProps>(), {
  min: 0,
  max: 100,
  value: 0,
  indeterminate: undefined,
});

if (props.min >= props.max)
  throw new Error(
    'The `min` value of a ProgressbarRoot should be less than the `max` value.',
  );

const calculatePercentage = (
  min: number,
  max: number,
  value: number,
): number => {
  if (value < min)
    throw new Error(
      'The `value` of a ProgressbarRoot should be greater than the `min` value.',
    );

  if (value > max)
    throw new Error(
      'The `value` of a ProgressbarRoot should be less than the `max` value.',
    );

  const rangeSpan = max - min;
  const relativePosition = value - min;
  const percentage = (relativePosition / rangeSpan) * 100;
  return percentage;
};

const percentage = computed(() =>
    parseFloat(
      calculatePercentage(props.min, props.max, props.value).toFixed(2),
    ),
  ),
  percentageText = computed(() => {
    if (props.indeterminate) return undefined;
    return props.valueText
      ? props.valueText(
          { min: props.min, max: props.max, value: percentage.value },
          !!props.indeterminate,
        )
      : `${percentage.value}%`;
  }),
  progressState = computed<ProgressbarStates>(() => {
    if (props.indeterminate) return 'loading';
    return (
      (percentage.value === props.min && 'empty') ||
      (percentage.value === props.max && 'completed') ||
      'loading'
    );
  });

provide<ProgressbarProvider>(PROGRESSBAR_PROVIDER_NAME, {
  percentage,
  percentageText,
  progressState,
  min: props.min,
  max: props.max,
  value: props.value,
  indeterminate: !!props.indeterminate,
});
</script>

<template>
  <div
    role="progressbar"
    :data-indeterminate="indeterminate"
    :data-state="progressState"
    :data-min="min"
    :data-max="max"
    :data-value="percentage"
    :aria-label="label"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="indeterminate ? undefined : percentage"
    :aria-valuetext="
      valueText
        ? valueText({ min, max, value: percentage }, !!indeterminate)
        : percentageText
    "
    :style="{
      '--progress-min': min,
      '--progress-max': max,
      '--progress-value': percentage,
      '--progress-percentage': percentageText,
    }"
  >
    <slot />
  </div>
</template>
