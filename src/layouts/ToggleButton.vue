<script setup lang="ts">
import { ref } from 'vue';
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupLabel,
} from '@/components/ToggleButton';

const isPlaying = ref(true),
  isEnabled = ref(false),
  selectedAlign = ref('align-left');
</script>

<template>
  <div class="toggle-button-layout">
    <toggle-button v-model="isPlaying" class="button" label="Play">
      {{ isPlaying ? 'Pause' : 'Play' }}
    </toggle-button>

    <toggle-button
      class="button"
      label="Enable feature"
      @change="(pressed) => (isEnabled = pressed)"
    >
      {{ isEnabled ? 'Disable' : 'Enable' }} Feature
    </toggle-button>

    <div class="button-group">
      <toggle-button-group-label class="label" html-for="align-button-group">
        Set text alignment
      </toggle-button-group-label>

      <toggle-button-group
        id="align-button-group"
        class="content"
        :default-pressed="selectedAlign"
        :data-selected-align="selectedAlign"
        @on-change="(name) => (selectedAlign = name)"
        aria-labelledby="my-for should-not damage-these-labels"
      >
        <toggle-button class="button" name="align-left">
          Align left
        </toggle-button>
        <toggle-button class="button" name="align-center">
          Align center
        </toggle-button>
        <toggle-button class="button" name="align-right">
          Align right
        </toggle-button>
      </toggle-button-group>
    </div>

    <div class="button-group">
      <toggle-button-group-label class="label" html-for="theme-button-group">
        Change theme settings
      </toggle-button-group-label>

      <toggle-button-group
        id="theme-button-group"
        class="button-group"
        default-pressed="dark-theme"
        multiple
        allow-all-unpressed
      >
        <toggle-button class="button" name="dark-theme">
          Enable dark theme
        </toggle-button>
        <toggle-button class="button" name="high-contrast">
          Enable high contrast
        </toggle-button>
        <toggle-button class="button" name="reduced-motion" disabled>
          Enable reduced motions
        </toggle-button>
      </toggle-button-group>
    </div>

    <div class="button-group">
      <toggle-button-group-label class="label" html-for="bunch-of-button-group">
        Just a bunch of buttons
      </toggle-button-group-label>

      <toggle-button-group
        id="bunch-of-button-group"
        class="button-group"
        use-tab-focusing
        disabled
      >
        <toggle-button class="button" name="item-1" default-pressed>
          Button 1
        </toggle-button>
        <toggle-button class="button" name="item-2">Button 2</toggle-button>
        <toggle-button class="button" name="item-3">Button 3</toggle-button>
      </toggle-button-group>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toggle-button-layout {
  padding: 16px;
  margin-top: 32px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  gap: 32px;
}

.button-group {
  .label {
    display: block;
    margin-bottom: 12px;
  }

  .content {
    display: flex;
    gap: 16px;
  }
}

.button {
  cursor: pointer;

  position: relative;
  max-width: 200px;
  padding: 1em 1.6em;

  font-weight: bold;
  color: #fff;

  border-radius: 4px;
  border: 1px solid #202020;
  background-color: #303030;

  transform-style: preserve-3d;
  transition: transform 0.1s cubic-bezier(0, 0, 1, 1);

  &::before {
    content: '';

    position: absolute;
    display: block;
    width: 100%;
    height: 99%;

    border-radius: inherit;
    border: 1px solid #202020;

    box-shadow: 0 10px 4px black;
    background-color: #202020;

    left: 0;

    transform: translate3d(-0, -1px, -1px);
    transition-property: transform, box-shadow;
    transition-duration: 0.1s;
    transition-timing-function: cubic-bezier(0, 0, 1, 1);
  }

  &:hover {
    transform: translateY(4px);
  }

  &:focus {
    outline: 2px solid white;
    outline-offset: 4px;
    transform: translateY(4px);
  }

  &[data-pressed='true'],
  &:active {
    transform: translateY(10px);

    &::before {
      box-shadow: 0 2px 4px black;
      transform: translate3d(-1px, -10px, -10px);
    }
  }
}
</style>
