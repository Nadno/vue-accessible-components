<script setup lang="ts">
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
</script>

<template>
  <div class="tabs-layout">
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
            name="apples"
            :selected="isTabSelected('apples')"
          >
            🍎 Apples
          </tab-item>

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

          <tab-item
            class="item"
            name="avocados"
            :selected="isTabSelected('avocados')"
          >
            🥑 Avocados
          </tab-item>

          <tab-item
            class="item"
            name="bananas"
            :selected="isTabSelected('bananas')"
          >
            🍌 Bananas
          </tab-item>
        </tab-list>

        <tab-content class="tab-content" detach-on-collapse>
          <tab-panel class="panel" :selected="isTabSelected('apples')">
            <h2>Apples</h2>

            <p>
              An apple is an edible fruit produced by an apple tree (Malus
              domestica). Apple trees are cultivated worldwide and are the most
              widely grown species in the genus Malus. The tree originated in
              Central Asia, where its wild ancestor, Malus sieversii, is still
              found today. Apples have been grown for thousands of years in Asia
              and Europe and were brought to North America by European
              colonists. Apples have religious and mythological significance in
              many cultures, including Norse, Greek, and European Christian
              tradition.
            </p>

            <p>
              Apples grown from seed tend to be very different from those of the
              parents, and the resultant fruit frequently lack desired
              characteristics. Generally then, apple cultivars are propagated by
              clonal grafting onto rootstocks. Apple trees grown without
              rootstocks tend to be larger and much slower to fruit after
              planting. Rootstocks are used to control speed of growth and the
              size of the resulting tree allowing for easier harvesting.
            </p>
          </tab-panel>

          <tab-panel class="panel" :selected="isTabSelected('oranges')">
            <h2>Oranges</h2>
            <p>
              An orange is a fruit of various citrus species in the family
              Rutaceae (see list of plants known as orange); it primarily refers
              to Citrus sinensis, which is also called sweet orange, to
              distinguish it from the related Citrus aurantium, referred to as
              bitter orange. The sweet orange reproduces asexually (apomixis
              through nucellar embryony); varieties of sweet orange arise
              through mutations.
            </p>

            <p>
              The orange is a hybrid between pomelo (Citrus maxima) and mandarin
              (Citrus reticulata). The chloroplast genome, and therefore the
              maternal line, is that of pomelo. The sweet orange has had its
              full genome sequenced.
            </p>

            <p>
              The orange originated in a region encompassing Southern China,
              Northeast India, and Myanmar, and the earliest mention of the
              sweet orange was in Chinese literature in 314 BC. As of 1987,
              orange trees were found to be the most cultivated fruit tree in
              the world.[10] Orange trees are widely grown in tropical and
              subtropical climates for their sweet fruit. The fruit of the
              orange tree can be eaten fresh, or processed for its juice or
              fragrant peel.[11] As of 2012, sweet oranges accounted for
              approximately 70% of citrus production.[12]
            </p>
          </tab-panel>

          <tab-panel class="panel" :selected="isTabSelected('strawberries')">
            <h2>Strawberries</h2>

            <p>
              The garden strawberry (or simply strawberry; Fragaria ananassa) is
              a widely grown hybrid species of the genus Fragaria, collectively
              known as the strawberries, which are cultivated worldwide for
              their fruit. The fruit is widely appreciated for its
              characteristic aroma, bright red color, juicy texture, and
              sweetness. It is consumed in large quantities, either fresh or in
              such prepared foods as jam, juice, pies, ice cream, milkshakes,
              and chocolates. Artificial strawberry flavorings and aromas are
              also widely used in products such as candy, soap, lip gloss,
              perfume, and many others.
            </p>

            <p>
              The garden strawberry was first bred in Brittany, France, in the
              1750s via a cross of Fragaria virginiana from eastern North
              America and Fragaria chiloensis, which was brought from Chile by
              Amédée-François Frézier in 1714. Cultivars of Fragaria ananassa
              have replaced, in commercial production, the woodland strawberry
              (Fragaria vesca), which was the first strawberry species
              cultivated in the early 17th century.
            </p>
          </tab-panel>

          <tab-panel class="panel" :selected="isTabSelected('watermelons')">
            <h2>Watermelons</h2>

            <p>
              Watermelon (Citrullus lanatus) is a flowering plant species of the
              Cucurbitaceae family and the name of its edible fruit. A
              scrambling and trailing vine-like plant, it is a highly cultivated
              fruit worldwide, with more than 1,000 varieties.
            </p>

            <p>
              Watermelon is grown in favorable climates from tropical to
              temperate regions worldwide for its large edible fruit, which is a
              berry with a hard rind and no internal divisions, and is
              botanically called a pepo. The sweet, juicy flesh is usually deep
              red to pink, with many black seeds, although seedless varieties
              exist. The fruit can be eaten raw or pickled, and the rind is
              edible after cooking. It may also be consumed as a juice or as an
              ingredient in mixed beverages.
            </p>

            <p>
              Watermelons are thought to be native to northeastern Africa. Wild
              watermelon seeds have been found in Uan Muhuggiag, a prehistoric
              site in Libya that dates to approximately 3500 BC. Watermelons
              were domesticated in Egypt by 2000 BC, and sweet dessert
              watermelons spread across the Mediterranean world during Roman
              times.
            </p>

            <p>
              Considerable breeding effort has developed disease-resistant
              varieties. Many cultivars are available that produce mature fruit
              within 100 days of planting. In 2017, China produced about
              two-thirds of the world total of watermelons.
            </p>
          </tab-panel>

          <tab-panel class="panel" :selected="isTabSelected('avocados')">
            <h2>Avocados</h2>

            <p>
              The avocado (Persea americana), a tree likely originating from
              south-central Mexico, is classified as a member of the flowering
              plant family Lauraceae. The fruit of the plant, also called an
              avocado (or avocado pear or alligator pear), is botanically a
              large berry containing a single large seed. Avocado trees are
              partially self-pollinating, and are often propagated through
              grafting to maintain predictable fruit quality and quantity.
            </p>

            <p>
              Avocados are cultivated in tropical and Mediterranean climates of
              many countries, with Mexico as the leading producer of avocados in
              2019, supplying 32% of the world total.
            </p>

            <p>
              The fruit of domestic varieties has a buttery flesh when ripe.
              Depending on the variety, avocados have green, brown, purplish, or
              black skin when ripe, and may be pear-shaped, egg-shaped, or
              spherical. Commercially, the fruits are picked while immature, and
              ripened after harvesting.
            </p>
          </tab-panel>

          <tab-panel class="panel" :selected="isTabSelected('bananas')">
            <h2>Bananas</h2>
            <p>
              A banana is an elongated, edible fruit – botanically a berry –
              produced by several kinds of large herbaceous flowering plants in
              the genus Musa. In some countries, bananas used for cooking may be
              called "plantains", distinguishing them from dessert bananas. The
              fruit is variable in size, color, and firmness, but is usually
              elongated and curved, with soft flesh rich in starch covered with
              a rind, which may be green, yellow, red, purple, or brown when
              ripe. The fruits grow upward in clusters near the top of the
              plant. Almost all modern edible seedless (parthenocarp) bananas
              come from two wild species – Musa acuminata and Musa balbisiana.
              The scientific names of most cultivated bananas are Musa
              acuminata, Musa balbisiana, and Musa paradisiaca for the hybrid
              Musa acuminata M. balbisiana, depending on their genomic
              constitution. The old scientific name for this hybrid, Musa
              sapientum, is no longer used.
            </p>

            <p>
              Musa species are native to tropical Indomalaya and Australia, and
              are likely to have been first domesticated in Papua New Guinea.
              They are grown in 135 countries, primarily for their fruit, and to
              a lesser extent to make fiber, banana wine, and banana beer and as
              ornamental plants. The world's largest producers of bananas in
              2017 were India and China, which together accounted for
              approximately 38% of total production.
            </p>

            <p>
              Worldwide, there is no sharp distinction between "bananas" and
              "plantains". Especially in the Americas and Europe, "banana"
              usually refers to soft, sweet, dessert bananas, particularly those
              of the Cavendish group, which are the main exports from
              banana-growing countries. By contrast, Musa cultivars with firmer,
              starchier fruit are called "plantains". In other regions, such as
              Southeast Asia, many more kinds of banana are grown and eaten, so
              the binary distinction is not as useful and is not made in local
              languages.
            </p>

            <p>
              The term "banana" is also used as the common name for the plants
              that produce the fruit. This can extend to other members of the
              genus Musa, such as the scarlet banana (Musa coccinea), the pink
              banana (Musa velutina), and the Fe'i bananas. It can also refer to
              members of the genus Ensete, such as the snow banana (Ensete
              glaucum) and the economically important false banana (Ensete
              ventricosum). Both genera are in the banana family, Musaceae.
            </p>
          </tab-panel>
        </tab-content>

        <small class="content-ref">content from Wikipedia</small>
      </div>
    </tab-root>
  </div>
</template>

<style lang="scss" scoped>
.tabs-layout {
  width: 100%;
  max-width: 700px;

  margin-right: auto;
  margin-left: auto;
}

.tab-bar {
  max-height: unset;
}

.tab-list {
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;

  & > .item {
    width: 30%;
    flex: 1 0 30%;
    min-height: 32px;
  }
}

.tab-content {
  overflow: initial;
  max-height: unset;
  margin-bottom: 8px;

  & > .panel {
    padding: 32px 16px;
    overflow: initial;
    max-height: unset;
  }
}

.content-ref {
  align-self: flex-end;
}
</style>
