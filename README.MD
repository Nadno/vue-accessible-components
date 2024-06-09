# Elementos acessíveis usando Vue.js

Neste repositório eu me inspirei na biblioteca `Reactjs` de componentes acessíveis `Radix`, a fim de estudar e praticar a **[WAI-ARIA e seus padrões](https://www.w3.org/WAI/ARIA/apg/patterns/)**.

Os componentes utilizam de diversas features do `Vue 3` de forma a disponibilizar componentes reutilizaveis e sem estilos. As features `Provide / Inject` e `Composables` foram essenciais para a criação dos componentes e passagem de estados e funcionalidades entre eles, assim como a separação de suas lógicas distintas.

**Veja os componentes funcionando em:** [nadno.github.io/vue-accessible-components/](https://nadno.github.io/vue-accessible-components/)

## Barras de progresso [(Padrão ↗)](https://www.w3.org/WAI/ARIA/apg/patterns/meter/)

O HTML define a [tag `<progress />`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/progress) que atende a esse mesmo padrão, porém para fins de aprendizado, e até de melhor customização e flexibilidade de uso, uma barra de progresso foi implementada.

O componente exige uma verbosidade um pouco maior que a tag `HTML`, porém permite um melhor uso de classes assim como estilização de seu elemento externo e interno.

### Exemplo:

```html
<progressbar-root
  class="progress-bar"
  label="Uploading image..."
  :min="0"
  :max="100"
  :value="60"
>
  <progressbar-indicator class="indicator" />
</progressbar-root>
```

## Accordions [(Padrão ↗)](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)

O componente define diversas seções colapsáveis uma em sequência da outra. Cada título das seções de um Accordion é também um botão que permite mostra ou esconder seu conteúdo. Ainda, a navegação por seus títulos pode ser tanto por tab, como por setas.

### Features

- Navegação entre seções irmãs por setas ou tab;
- Restrição de pelo menos uma seção aberta;
- Restrição de apenas uma seção aberta por vez;

### Exemplo:

```html
<accordion-root
  id="one-opened"
  class="accordion-block"
  default-opened="qux"
  detach-on-hide
  avoid-all-panels-closed
>
  <accordion-section name="foo" class="section">
    <accordion-heading is="h3" class="title">
      <accordion-trigger class="trigger">Seção 1</accordion-trigger>
    </accordion-heading>

    <accordion-panel class="panel">...</accordion-panel>
  </accordion-section>

  <accordion-section name="bar" class="section">
    <accordion-heading is="h3" class="title">
      <accordion-trigger class="trigger">Seção 2</accordion-trigger>
    </accordion-heading>

    <accordion-panel class="panel">...</accordion-panel>
  </accordion-section>

  <accordion-section name="qux" class="section">
    <accordion-heading is="h3" class="title">
      <accordion-trigger class="trigger">Seção 3</accordion-trigger>
    </accordion-heading>

    <accordion-panel class="panel">...</accordion-panel>
  </accordion-section>
</accordion-root>
```

## Tabs [(Padrão ↗)](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)

O padrão Tabs, fornece abas (iguais as dos navegadores) dentro do HTML, garantindo previsibilidade aos usuários se tratando do comportamento esperado.

### Features

- A navegação pelas abas ocorre por setas;
- Cada aba deve servir de rótulo para seus paineis;
- Uso controlado por estado ou associação automatica por nomes;

### Exemplo:

```typescript
import { ref } from 'vue';
import {
  TabRoot,
  TabList,
  TabItem,
  TabContent,
  TabPanel,
  TabTitle,
} from '@/components/Tab';

const selectedTab = ref('apples');

const isTabSelected = (name: string) => selectedTab.value === name;

const selectTab = (name: string) => (selectedTab.value = name);
```

```html
<tab-root>
  <div class="tab-bar">
    <tab-title is="h2" class="title">Fruits</tab-title>

    <tab-list
      class="tab-list"
      loop
      v-on:tab-select="({ selecting }) => selectTab(selecting as string)"
    >
      <tab-item
        class="item"
        name="oranges"
        :selected="isTabSelected('oranges')"
      >
        🍊 Oranges
      </tab-item>

      <tab-item
        class="item"
        name="strawberries"
        :selected="isTabSelected('strawberries')"
      >
        🍓 Strawberries
      </tab-item>

      <tab-item
        class="item"
        name="watermelons"
        :selected="isTabSelected('watermelons')"
      >
        🍉 Watermelons
      </tab-item>
    </tab-list>

    <tab-content class="tab-content" detach-on-collapse>
      <tab-panel class="panel" :selected="isTabSelected('oranges')">
        ...
      </tab-panel>

      <tab-panel class="panel" :selected="isTabSelected('strawberries')">
        ...
      </tab-panel>

      <tab-panel class="panel" :selected="isTabSelected('watermelons')">
        ...
      </tab-panel>
    </tab-content>

    <small class="content-ref">content from Wikipedia</small>
  </div>
</tab-root>
```

## Modal Dialog [(Padrão ↗)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

Um diálogo (dialog) é um popup que possui o intuito de chamar a atenção do usuário, ele pode ser de dois tipos, modal - interrompe o fluxo atual da aplicação e força o usuário a interagir com ele -, e non-modal (não modal) que apesar de aparecer na tela, não interrompe o fluxo atual e nem força o usuário a interagir com ele.

### Features

- Modal e non-modal com o atributo `[modal]`;
- `[loop]`, prende o foco (`Tab`) do usuário no modal atual;
- `[static]`, força a interação do usuário com o modal;

Na prática as três features acima são necessarias para uma interação do tipo `modal`, mas dependendo das necessidades, é possível optar por cada uma delas.

### Exemplo:

```html
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
          perferendis numquam pariatur aliquam rem sapiente temporibus inventore
          tempore aliquid saepe.
        </p>

        <dialog-close class="close">&times;</dialog-close>
      </dialog-content>
    </dialog-overlay>
  </dialog-portal>
</dialog-root>
```
