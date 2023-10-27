<script setup lang="ts">
import { ref } from 'vue';

import {
  Switcher,
  SwitcherIndicator,
  SwitcherLabel,
  SwitcherGroup,
  SwitcherGroupLabel,
} from '@/components/Switcher';

const isChecked = ref(true);
</script>

<template>
  <div class="switch-layout">
    <div class="switch-field">
      <switcher-label class="label" html-for="enable-feature">
        Enable feature:
      </switcher-label>

      <switcher v-model="isChecked" class="switch" id="enable-feature">
        <switcher-indicator class="indicator" v-html="isChecked ? '&#x2713' : '&times;'" />
      </switcher>
    </div>

    <div class="switch-group">
      <switcher-group-label class="label" html-for="chose-types">
        Chose type:
      </switcher-group-label>

      <switcher-group
        id="chose-types"
        class="content"
        focus-orientation="vertical"
        use-tab-focusing
        default-checked="type-2"
      >
        <div class="switch-field">
          <switcher-label class="label" html-for="type-1">
            Chose type 1:
          </switcher-label>

          <switcher class="switch" id="type-1" name="type-1">
            <switcher-indicator class="indicator" />
          </switcher>
        </div>

        <div class="switch-field">
          <switcher-label class="label" html-for="type-2">
            Chose type 2:
          </switcher-label>

          <switcher class="switch" id="type-2" name="type-2">
            <switcher-indicator class="indicator" />
          </switcher>
        </div>

        <div class="switch-field">
          <switcher-label class="label" html-for="type-3">
            Chose type 3:
          </switcher-label>

          <switcher class="switch" id="type-3" name="type-3">
            <switcher-indicator class="indicator" />
          </switcher>
        </div>
      </switcher-group>
    </div>

    <div class="switch-group">
      <switcher-group-label class="label" html-for="accessability-features">
        Accessibility features:
      </switcher-group-label>

      <switcher-group
        id="accessability-features"
        class="content"
        focus-orientation="vertical"
        multiple
        allow-all-unpressed
        use-focus-looping
      >
        <div class="switch-field">
          <switcher-label class="label" html-for="feature-shortcuts">
            Enable shortcuts:
          </switcher-label>

          <switcher
            class="switch"
            id="feature-shortcuts"
            name="feature-shortcuts"
          >
            <switcher-indicator class="indicator" />
          </switcher>
        </div>

        <div class="switch-field">
          <switcher-label class="label" html-for="feature-captions">
            Enable image captions:
          </switcher-label>

          <switcher
            class="switch"
            id="feature-captions"
            name="feature-captions"
          >
            <switcher-indicator class="indicator" />
          </switcher>
        </div>

        <div class="switch-field">
          <switcher-label class="label" html-for="feature-text-audios">
            Enable text audios:
          </switcher-label>

          <switcher
            class="switch"
            id="feature-text-audios"
            name="feature-text-audios"
          >
            <switcher-indicator class="indicator" />
          </switcher>
        </div>
      </switcher-group>
    </div>

    <div class="switch-group">
      <switcher-group-label class="label" html-for="other-features">
        Other features:
      </switcher-group-label>

      <switcher-group
        id="other-features"
        class="content"
        focus-orientation="vertical"
        disabled
      >
        <div class="switch-field">
          <switcher-label class="label" html-for="enable-sounds">
            Enable sounds:
          </switcher-label>

          <switcher
            class="switch"
            id="enable-sounds"
            name="enable-sounds"
            default-checked
          >
            <switcher-indicator class="indicator" />
          </switcher>
        </div>

        <div class="switch-field">
          <switcher-label class="label" html-for="enable-animations">
            Enable animations:
          </switcher-label>

          <switcher
            class="switch"
            id="enable-animations"
            name="enable-animations"
          >
            <switcher-indicator class="indicator" />
          </switcher>
        </div>

        <div class="switch-field">
          <switcher-label class="label" html-for="enable-custom-menu">
            Enable custom menu:
          </switcher-label>

          <switcher
            class="switch"
            id="enable-custom-menu"
            name="enable-custom-menu"
          >
            <switcher-indicator class="indicator" />
          </switcher>
        </div>
      </switcher-group>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.switch-layout {
  padding: 16px;
  margin-top: 32px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  gap: 32px;
}

.switch-group {
  width: 100%;
  max-width: 400px;

  & > .label {
    display: block;
    margin-bottom: 8px;
    font-size: 1.4rem;
  }

  & > .content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.switch-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  & > .label {
    font-size: 1rem;
  }

  & > .switch {
    font-size: 12px;
    width: 4em;
    min-width: 4em;
    max-width: 4em;
    padding: 0.2em;
    border: 2px solid white;
    border-radius: 99px;
    background-color: #f5f5f5;
    box-sizing: content-box;

    & > .indicator {
      position: relative;
      width: 1.5em;
      height: 1.5em;
      border-radius: 50%;
      background-color: #111;
      color: white;

      display: flex;
      align-items: center;
      justify-content: center;

      left: 0;
      top: 0;
      transition: transform 200ms ease;
    }

    &[data-checked='true'] > .indicator {
      transform: translateX(calc(4em - 1.5em - 0.2em));
    }

    &:not([data-disabled]) {
      cursor: pointer;
    }

    &:focus {
      outline: 2px solid white;
      outline-offset: 4px;
    }
  }
}
</style>
