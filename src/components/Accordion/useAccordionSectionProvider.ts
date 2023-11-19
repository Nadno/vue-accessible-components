import { inject } from 'vue';
import {
  ACCORDION_SECTION_PROVIDER_NAME,
  AccordionSectionProvider,
} from './AccordionSection.vue';

export const useAccordionSectionProvider = (
  name = 'useAccordionSectionProvider',
): AccordionSectionProvider => {
  const provider = inject<AccordionSectionProvider>(
    ACCORDION_SECTION_PROVIDER_NAME,
  );
  if (!provider)
    throw new Error(`You should use "${name}" within a "AccordionSection" only!`);

  return provider;
};
