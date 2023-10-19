import { inject } from 'vue';
import { TOOLTIP_PROVIDER_NAME, TooltipProvider } from './TooltipRoot.vue';

export const useTooltipProvider = (
  name = 'useTooltipProvider',
): TooltipProvider => {
  const provider = inject<TooltipProvider>(TOOLTIP_PROVIDER_NAME);
  if (!provider)
    throw new Error(`You should use "${name}" within a "TooltipRoot" only!`);

  return provider;
};
