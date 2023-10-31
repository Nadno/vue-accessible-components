<script setup lang="ts">
import { ref } from 'vue';
import {
  Radio,
  RadioIndicator,
  RadioLabel,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupDescription,
} from '@/components/Radio';

const selectedType = ref('radio-type-2');
</script>

<template>
  <div class="radio-layout">
    <div class="radio-group">
      <radio-group-label class="label" html-for="chose-radio-types">
        Chose type (Radio):
      </radio-group-label>

      <radio-group-description html-for="chose-radio-types" class="description">
        A chose type example, using radios buttons. They're more specific than
        the last ones, as it only accepts button checked at a time, and has its
        focus always by roving
        <code>tabindex</code>
        .
      </radio-group-description>

      <radio-group
        v-model="selectedType"
        id="chose-radio-types"
        class="content"
        focus-orientation="both"
        use-tab-focusing
      >
        <div class="radio-field">
          <radio-label class="label" html-for="radio-type-1">
            Chose type 1:
          </radio-label>

          <radio class="radio" id="radio-type-1" name="radio-type-1">
            <radio-indicator class="indicator" />
          </radio>
        </div>

        <div class="radio-field">
          <radio-label class="label" html-for="radio-type-2">
            Chose type 2:
          </radio-label>

          <radio class="radio" id="radio-type-2" name="radio-type-2">
            <radio-indicator class="indicator" />
          </radio>
        </div>

        <div class="radio-field">
          <radio-label class="label" html-for="radio-type-3">
            Chose type 3:
          </radio-label>

          <radio class="radio" id="radio-type-3" name="radio-type-3">
            <radio-indicator class="indicator" />
          </radio>
        </div>
      </radio-group>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.radio-layout {
  padding: 16px;
  margin-top: 32px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  gap: 32px;
}

.radio-group {
  width: 100%;
  max-width: 400px;

  & > .label {
    display: block;
    margin-bottom: 8px;
    font-size: 1.4rem;
  }

  & > .description {
    display: block;
    margin-bottom: 16px;
  }

  & > .content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.radio-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  & > .label {
    font-size: 1rem;
  }

  & > .radio {
    font-size: 12px;
    width: 1.25em;
    height: 1.25em;
    padding: 0.4em;
    border: 2px solid white;
    border-radius: 99px;
    background-color: #f5f5f5;
    box-sizing: content-box;

    display: flex;
    align-items: center;
    justify-content: center;

    & > .indicator {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #111;
      color: white;

      transition: opacity 250ms ease-in;
    }

    &[data-checked='false'] > .indicator {
      opacity: 0;
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
