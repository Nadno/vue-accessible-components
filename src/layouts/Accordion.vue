<script lang="ts" setup>
import {
  AccordionRoot,
  AccordionSection,
  AccordionHeading,
  AccordionTrigger,
  AccordionPanel,
  GetAccordionTitleHandler,
} from '@/components/Accordion';

const getAccordionTitle: GetAccordionTitleHandler = (name, type, id) => {
  if (!id) throw new Error('All accordions should have an id!');
  return `accordion-${id}-${name}-${type}`;
};
</script>

<template>
  <div class="accordion-layout">
    <section class="accordion-wrapper">
      <h2 class="title">No restrictions</h2>

      <accordion-root
        id="no-restrictions"
        class="accordion-block"
        loop
        :get-accordion-title="getAccordionTitle"
      >
        <accordion-section name="foo" class="section" default-opened>
          <accordion-heading is="h3" class="title">
            <accordion-trigger class="trigger">
              Foo lorem, ipsum dolor.
            </accordion-trigger>
          </accordion-heading>

          <accordion-panel class="panel">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad nemo
            eum, veritatis, eveniet, nulla velit iusto inventore beatae quod
            necessitatibus
            <a href="#" class="link">dolorem quis</a>
            perferendis error dicta quisquam repudiandae cum voluptas soluta
            perspiciatis harum pariatur cumque quas. Praesentium dolorum
            perferendis est laborum?
          </accordion-panel>
        </accordion-section>

        <accordion-section name="bar" class="section">
          <accordion-heading is="h3" class="title">
            <accordion-trigger class="trigger">
              Bar lorem, ipsum dolor.
            </accordion-trigger>
          </accordion-heading>

          <accordion-panel class="panel">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic
            deleniti nobis error modi eum recusandae a aperiam fugit veritatis
            iusto, cumque sunt <a href="#" class="link">dolorem quis</a> commodi pariatur omnis ipsam et fugiat
            unde quis delectus beatae molestiae, vero vitae! Quod minus ab earum
            quae, et inventore, culpa temporibus omnis illum praesentium hic a
            corporis commodi error recusandae itaque deserunt provident maiores
            incidunt. Quas?
          </accordion-panel>
        </accordion-section>

        <accordion-section name="qux" class="section">
          <accordion-heading is="h3" class="title">
            <accordion-trigger class="trigger">
              Qux lorem, ipsum dolor.
            </accordion-trigger>
          </accordion-heading>

          <accordion-panel class="panel">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
            perspiciatis, culpa accusantium expedita exercitationem cumque
            repellat <a href="#" class="link">dolorem quis</a> delectus deleniti quos!
          </accordion-panel>
        </accordion-section>
      </accordion-root>
    </section>

    <section class="accordion-wrapper">
      <h2 class="title">At least one opened</h2>

      <accordion-root
        id="one-opened"
        class="accordion-block"
        default-opened="qux"
        detach-on-hide
        avoid-all-panels-closed
        :get-accordion-title="getAccordionTitle"
      >
        <accordion-section name="foo" class="section">
          <accordion-heading is="h3" class="title">
            <accordion-trigger class="trigger">
              Foo lorem, ipsum dolor.
            </accordion-trigger>
          </accordion-heading>

          <accordion-panel class="panel">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad nemo
            eum, veritatis, eveniet, nulla velit iusto inventore beatae quod
            necessitatibus
            <a class="link" href="#">dolorem quis perferendis</a>
            error dicta quisquam repudiandae cum voluptas soluta perspiciatis
            harum pariatur cumque quas. Praesentium dolorum perferendis est
            laborum?
          </accordion-panel>
        </accordion-section>

        <accordion-section name="bar" class="section">
          <accordion-heading is="h3" class="title">
            <accordion-trigger class="trigger">
              Bar lorem, ipsum dolor.
            </accordion-trigger>
          </accordion-heading>

          <accordion-panel class="panel">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic
            deleniti nobis error modi eum recusandae a aperiam fugit veritatis
            iusto, <a href="#" class="link">dolorem quis</a> sunt distinctio commodi pariatur omnis ipsam et fugiat
            unde quis delectus beatae molestiae, vero vitae! Quod minus ab earum
            quae, et inventore, culpa temporibus omnis illum praesentium hic a
            corporis commodi error recusandae itaque deserunt provident maiores
            incidunt. Quas?
          </accordion-panel>
        </accordion-section>

        <accordion-section name="qux" class="section">
          <accordion-heading is="h3" class="title">
            <accordion-trigger class="trigger">
              Qux lorem, ipsum dolor.
            </accordion-trigger>
          </accordion-heading>

          <accordion-panel class="panel">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
            perspiciatis, <a href="#" class="link">dolorem quis</a> accusantium expedita exercitationem cumque
            repellat quis delectus deleniti quos!
          </accordion-panel>
        </accordion-section>
      </accordion-root>
    </section>

    <section class="accordion-wrapper">
      <h2 class="title">Only once opened at a time</h2>

      <accordion-root
        id="once-at-time"
        class="accordion-block"
        default-opened="qux"
        detach-on-hide
        avoid-all-panels-closed
        :multiple="false"
        :get-accordion-title="getAccordionTitle"
      >
        <accordion-section name="foo" class="section">
          <accordion-heading is="h3" class="title">
            <accordion-trigger class="trigger">
              Foo lorem, ipsum dolor.
            </accordion-trigger>
          </accordion-heading>

          <accordion-panel class="panel">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad nemo
            eum, veritatis, eveniet, nulla velit iusto inventore beatae quod
            necessitatibus <a href="#" class="link">dolorem quis</a> perferendis error dicta quisquam
            repudiandae cum voluptas soluta perspiciatis harum pariatur cumque
            quas. Praesentium dolorum perferendis est laborum?
          </accordion-panel>
        </accordion-section>

        <accordion-section name="bar" class="section">
          <accordion-heading is="h3" class="title">
            <accordion-trigger class="trigger">
              Bar lorem, ipsum dolor.
            </accordion-trigger>
          </accordion-heading>

          <accordion-panel class="panel">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic
            deleniti nobis error modi eum recusandae a aperiam fugit veritatis
            iusto, cumque <a href="#" class="link">dolorem quis</a> distinctio commodi pariatur omnis ipsam et fugiat
            unde quis delectus beatae molestiae, vero vitae! Quod minus ab earum
            quae, et inventore, culpa temporibus omnis illum praesentium hic a
            corporis commodi error recusandae itaque deserunt provident maiores
            incidunt. Quas?
          </accordion-panel>
        </accordion-section>

        <accordion-section name="qux" class="section">
          <accordion-heading is="h3" class="title">
            <accordion-trigger class="trigger">
              Qux lorem, ipsum dolor.
            </accordion-trigger>
          </accordion-heading>

          <accordion-panel class="panel">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
            perspiciatis, culpa <a href="#" class="link">dolorem quis</a> expedita exercitationem cumque
            repellat quis delectus deleniti quos!
          </accordion-panel>
        </accordion-section>
      </accordion-root>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.accordion-layout {
  max-width: 600px;
  margin-right: auto;
  margin-left: auto;
}

.accordion-wrapper {
  & > .title {
    font-size: 28px;
    margin-bottom: 16px;
  }
}

.accordion-block {
  margin-bottom: 32px;

  .section {
    .trigger {
      position: relative;
      width: 100%;
      display: block;
      font-size: 18px;

      padding: 0.4em 0.8em;
      border: none;
      text-align: left;
      border-bottom: 1px solid #c1c1c1;

      background-color: white;

      &::after {
        content: '';

        position: absolute;
        width: 14px;
        height: 14px;
        display: block;

        border-right: 4px solid #111;
        border-top: 4px solid #111;

        right: 0.8em;
        top: 50%;
        transform-origin: center;
        transform: translate(0, -70%) rotate(135deg);
      }

      &:not([data-disabled]) {
        cursor: pointer;
      }

      &[data-opened='true']::after {
        transform: translate(0, -30%) rotate(315deg);
      }
    }

    .panel {
      padding: 16px;
      margin-bottom: 24px;

      &[data-opened='false'] {
        display: none;
      }
    }
  }

  .link {
    color: inherit;
  }
}
</style>
