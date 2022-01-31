<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            @input="suggestedCoins(), (this.$emit('error', false))"
            @keydown.enter="add(ticker)"
            v-model="ticker"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          />
        </div>
        <div
          v-if="suggestedCoins().length && ticker.length"
          class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
        >
          <span
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
            v-for="coin in suggestedCoins()"
            :key="coin"
            @click="add(coin)"
          >
            {{ coin }}
          </span>
        </div>
        <div v-if="error" class="text-sm text-red-600">
          Такой тикер уже добавлен
        </div>
      </div>
    </div>
    <add-button @click="add(ticker)" />
  </section>
</template>

<script>
import AddButton from './AddButton.vue';
export default {
  components: { AddButton },
  data() {
    return {
      ticker: ""
    };
  },
  props: {
      coins: {
          required: true,
          validator: prop => typeof prop === 'object' || prop === null,
          default: null
      },
      error: {
          type: Boolean,
          required: true,
          default: false
      }
  },
  methods: {
    add(ticker) {
        this.$emit('add-ticker', ticker);
        this.ticker = '';
 
    },
    suggestedCoins() {
      let sCoins = [];
      if (this.coins) {
        for (let coin of Object.values(this.coins)) {
          if (
            coin.FullName.toLowerCase().includes(this.ticker.toLowerCase()) ||
            coin.Symbol.includes(this.ticker.toUpperCase())
          ) {
            sCoins.push(coin.Symbol);
          }
        }
      }
      if (sCoins.length > 4) {
        return sCoins.slice(0, 4);
      } else {
        return sCoins;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
