import { inject } from 'vue';
import {
  AUTOCOMPLETE_PROVIDER_NAME,
  AutocompleteProvider,
} from './AutocompleteRoot.vue';

export const useAutocompleteProvider = (
  name = 'useAutocompleteProvider',
): AutocompleteProvider => {
  const provider = inject<AutocompleteProvider>(
    AUTOCOMPLETE_PROVIDER_NAME,
  );
  if (!provider)
    throw new Error(`You should use "${name}" within a "AutocompleteRoot" only!`);

  return provider;
};
