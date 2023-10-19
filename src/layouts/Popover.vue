<script setup lang="ts">
import {
  PopoverRoot,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
  PopoverClose,
} from '@/components/Popover';

import {
  TooltipRoot,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '@/components/Tooltip';
</script>

<template>
  <div class="popover-layout">
    <popover-root>
      <tooltip-root as-label>
        <tooltip-trigger
          :is="PopoverTrigger"
          class="popover-trigger"
          aria-labelledby="still-can-have-multiple-labelled-values"
        >
          [SOME ICON]
        </tooltip-trigger>

        <tooltip-portal>
          <tooltip-content
            container-class="tooltip"
            side="top"
            :offset="[0, 16]"
            class="popover-tooltip"
          >
            Open popover
          </tooltip-content>
        </tooltip-portal>
      </tooltip-root>

      <popover-portal>
        <popover-content
          container-class="popover-container"
          class="popover"
          side="bottom"
          align="center"
          :offset="[0, 16]"
          loop
        >
          <div class="content">
            <h1 class="title">Lorem ipsum dolor sit amet consectetur.</h1>

            <p class="description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque
              hic quam corrupti dignissimos, quia illo eos maiores vel ullam
              provident!
            </p>
          </div>

          <div class="actions">
            <tooltip-root>
              <tooltip-trigger :is="PopoverClose" class="button">
                Accept
              </tooltip-trigger>

              <tooltip-content
                container-class="tooltip"
                side="top"
                :offset="[0, 16]"
                class="popover-tooltip"
              >
                Accept and close.
              </tooltip-content>
            </tooltip-root>

            <tooltip-root>
              <tooltip-trigger :is="PopoverClose" class="button">
                Close
              </tooltip-trigger>

              <tooltip-content
                container-class="tooltip"
                side="top"
                :offset="[0, 16]"
                class="popover-tooltip"
              >
                Just close.
              </tooltip-content>
            </tooltip-root>
          </div>
        </popover-content>
      </popover-portal>
    </popover-root>
  </div>
</template>

<style scoped lang="scss">
.popover-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
  margin-bottom: 32px;
}

.button,
.popover-trigger {
  cursor: pointer;
  appearance: none;

  display: inline-block;
  padding: 8px;
  border-radius: 4px;

  border: none;
  background-color: #fff;

  text-transform: uppercase;
}

.popover-container {
  width: 100%;
  max-width: 350px;
  max-height: 100vh;

  & :deep(.popover) {
    width: 100%;
    min-height: inherit;
    max-height: inherit;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;

    overflow-y: auto;
    scrollbar-width: thin;
    border-radius: 4px;
    background-color: lighten(#111, 10%);

    opacity: 0;
    transform: translateY(-16px);

    &[data-state='open'] {
      opacity: 1;
      transform: translateY(0px);
      transition: transform 400ms ease, opacity 200ms ease;
    }

    .title {
      font-size: 24px;
      margin-bottom: 8px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
    }
  }
}

.tooltip:deep(.popover-tooltip) {
  padding: 8px;
  overflow-y: auto;
  scrollbar-width: thin;
  border-radius: 4px;
  background-color: lighten(#111, 10%);
}
</style>
