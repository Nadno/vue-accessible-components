<script setup lang="ts">
import { ref } from 'vue';
import {
  AutocompleteRoot,
  AutocompleteInput,
  AutocompleteList,
  AutocompleteLabel,
} from '@/components/Autocomplete';

type InputOption = { name: string; age: number };

const formStatus = ref('none');

const autocompleteOptions: Array<InputOption> = [
  { name: 'Emma Johnson', age: 28 },
  { name: 'Benjamin Miller', age: 35 },
  { name: 'Olivia Davis', age: 24 },
  { name: 'William Clark', age: 30 },
  { name: 'Sophia Mitchell', age: 29 },
  { name: 'James Anderson', age: 32 },
  { name: 'Ava Wilson', age: 27 },
  { name: 'Daniel Baker', age: 31 },
  { name: 'Mia Martinez', age: 26 },
  { name: 'Liam Wright', age: 33 },
];

const getOptionValue = (option: InputOption) => option.name;

const handleSearchSubmit = () => {
  formStatus.value = 'sending';

  setTimeout(() => {
    formStatus.value = 'sended';

    setTimeout(() => {
      formStatus.value = 'none';
    }, 2000);
  }, 2500);
};
</script>

<template>
  <form class="autocomplete-layout" @submit.prevent="handleSearchSubmit">
    <autocomplete-root :get-option-value="getOptionValue">
      <autocomplete-label html-for="search-for-user-autocomplete">
        Search for user:
      </autocomplete-label>

      <autocomplete-input
        id="search-for-user-autocomplete"
        class="autocomplete-input"
      />

      <autocomplete-list
        container-class="autocomplete-list-container"
        class="autocomplete-list"
        option-class="item"
        with-new-option-at="end"
        :options="autocompleteOptions"
        :offset="[0, 8]"
      >
        <template #option="{ option }">
          Name: {{ option.name }}
          <br />
          Age: {{ option.age }}
        </template>

        <template #new-option="{ search }">Create new "{{ search }}"</template>

        <template #status="{ options, withNewOptionAt }">
          <span v-if="!options.length && !withNewOptionAt">Empty</span>
        </template>
      </autocomplete-list>
    </autocomplete-root>

    <p>Search form status: {{ formStatus }}</p>
  </form>
</template>

<style scoped lang="scss">
.autocomplete-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  margin-top: 32px;
  margin-bottom: 32px;
}

.autocomplete-input {
  width: 100%;
  max-width: 300px;
  padding: 8px;
  border: none;
  border-radius: 0;
  background-color: whitesmoke;
}

.autocomplete-list-container {
  width: 100%;
  max-width: 300px;
  max-height: 100vh;
  min-height: 200px;
  overflow-y: auto;
  scrollbar-width: thin;

  background-color: lighten(#111, 10%);
  z-index: 10;

  & :deep(.autocomplete-list) {
    width: 100%;
    min-height: inherit;

    display: flex;
    flex-direction: column;

    padding: 4px;

    opacity: 0;
    transform: translateY(-16px);

    &[data-state='open'] {
      opacity: 1;
      transform: translateY(0px);
      transition: transform 400ms ease, opacity 200ms ease;
    }

    .item + .item {
      margin-top: 2px;
    }

    .item {
      appearance: none;

      display: inline-block;
      padding: 8px;

      border: none;
      border-radius: 4px;
      color: whitesmoke;
      background-color: lighten(#111, 10%);

      text-transform: uppercase;

      &:hover:not([data-disabled='true']),
      &[data-focused]:not([data-disabled='true']),
      &[data-active]:not([data-disabled='true']) {
        cursor: pointer;
        background-color: #111;
        outline: none;
      }

      &[data-disabled='true'] {
        opacity: 0.5;
        pointer-events: none;
      }
    }

    .separator {
      width: 100%;
      height: 1px;
      background-color: lighten(#111, 25%);
    }
  }
}
</style>
