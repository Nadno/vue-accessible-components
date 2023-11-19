import { inject } from 'vue';
import {
  ACCORDION_PROVIDER_NAME,
  AccordionProvider,
} from './AccordionRoot.vue';

export const useAccordionProvider = (
  name = 'useAccordionProvider',
): AccordionProvider => {
  const provider = inject<AccordionProvider>(ACCORDION_PROVIDER_NAME);
  if (!provider)
    throw new Error(`You should use "${name}" within a "AccordionRoot" only!`);

  return provider;
};

