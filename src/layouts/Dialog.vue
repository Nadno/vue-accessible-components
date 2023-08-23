<script setup lang="ts">
import {
  DialogRoot,
  DialogContent,
  DialogTitle,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogPortal,
} from '@/components/Dialog';
</script>

<template>
  <div class="dialog-layout">
    <dialog-root>
      <dialog-trigger class="dialog-trigger">Open modal</dialog-trigger>

      <dialog-portal>
        <dialog-overlay class="dialog-overlay">
          <dialog-content class="dialog-modal" modal loop static>
            <dialog-title is="h2" class="title">
              Lorem ipsum dolor sit amet.
            </dialog-title>

            <p class="content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
              perferendis numquam pariatur aliquam rem sapiente temporibus
              inventore tempore aliquid saepe.
            </p>

            <dialog-close class="close">&times;</dialog-close>
          </dialog-content>
        </dialog-overlay>
      </dialog-portal>
    </dialog-root>
  </div>
</template>

<style scoped lang="scss">
.dialog-layout {
  padding: 8px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-trigger {
  cursor: pointer;
  appearance: none;

  display: inline-block;
  padding: 8px;
  border-radius: 4px;

  border: none;
  background-color: #fff;

  text-transform: uppercase;
}

.dialog-overlay {
  position: fixed;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  background-color: rgba(#fff, 0.075);

  left: 0;
  top: 0;
  z-index: 999;

  opacity: 0;
  transition: opacity 200ms ease;

  &[data-state='open'] {
    opacity: 1;
  }
}

.dialog-modal {
  position: relative;
  width: 100%;
  max-width: 600px;
  padding: 16px;
  border-radius: 8px;
  color: #111;
  background-color: #f1f1f1;

  transform: scale(0.9);
  transition: transform 300ms ease;

  & {
    &[data-state='open'] {
      transform: scale(1);
    }
  }

  & > .title {
    font-size: 24px;
    margin-bottom: 8px;
  }

  & > .close {
    cursor: pointer;

    position: absolute;
    padding: 8px;
    border: none;
    background-color: transparent;

    font-size: 20px;

    top: 0;
    right: 8px;

    &:focus {
      outline: yellowgreen;
    }
  }
}
</style>
