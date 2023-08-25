<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import {
  ProgressbarRoot,
  ProgressbarIndicator,
} from '@/components/Progressbar';

const progressValue = ref(0);

let intervalId: NodeJS.Timeout;

onMounted(() => {
  intervalId = setInterval(
    () => (progressValue.value = Math.random() * 100),
    2000,
  );
});

onUnmounted(() => clearInterval(intervalId));
</script>

<template>
  <div class="progressbar-layout">
    <progressbar-root
      class="progress-bar"
      label="Uploading image..."
      :value="progressValue"
    >
      <progressbar-indicator class="indicator" />
    </progressbar-root>

    <progressbar-root
      class="progress-bar"
      label="Loading..."
      indeterminate
    >
      <progressbar-indicator class="indicator" />
    </progressbar-root>
  </div>
</template>

<style lang="scss" scoped>
.progressbar-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  gap: 16px;
}

.progress-bar {
  position: relative;
  width: 100%;
  max-width: 500px;
  padding: 8px;
  background-color: whitesmoke;

  &:not([data-indeterminate='true']) .indicator {
    position: relative;
    height: 16px;
    background-color: #111;

    transform-origin: left;
    transform: scaleX(calc(var(--progress-value) / 100));

    transition: transform ease 500ms;
  }

  &[data-indeterminate='true'] .indicator {
    position: relative;
    height: 16px;
    overflow: hidden;
    

    @keyframes indeterminate-animation {
      0% {
        transform: translateX(-150%);
      }

      50% {
        transform: translateX(-50%);
      }

      100% {
        transform: translateX(150%);
      }
    }

    &::before {
      content: '';

      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #111;
      left: 0;
      top: 0;

      animation: indeterminate-animation 1500ms linear forwards infinite;
    }
  }
}
</style>
