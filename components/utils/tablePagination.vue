<template>
  <!-- TODO: remove the component or move pagination from data table here -->
  <footer class="pagination">
    <div class="controls">
      <!-- v-ripple="'rgba(255, 255, 255, .3)'" -->
      <span
        class="prev nav"
        :class="{ disabled: !meta.prevPage }"
        @click="prev"
      >
        Previous
      </span>
      <span class="page-info">
        {{ start }} - {{ end }} of {{ total }}
      </span>
      <!-- v-ripple="'rgba(255, 255, 255, .3)'" -->
      <span
        class="next nav"
        :class="{ disabled: !meta.nextPage }"
        @click="next"
      >
        Next
      </span>
    </div>
  </footer>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    perPage: {
      type: Number,
      default: 50
    },
    meta: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    page() {
      return this.meta.currentPage || 1
    },
    start() {
      return ((this.page - 1) * this.perPage) + 1
    },
    end() {
      let total = 0
      if (this.perPage < this.meta.totalRows) {
        total = ((this.page - 1) * this.perPage) + this.perPage
      } else {
        total = this.meta.totalRows
      }
      if (total > this.meta.totalRows) return this.meta.totalRows
      return total
    },
    total() {
      return this.meta.totalRows || 0
    }
  },
  methods: {
    next() {
      const { nextPage } = this.meta
      if (!nextPage) return
      this.$eventBus.$emit(`next${this.id ? ('-' + this.id) : ''}-page`)
    },
    prev() {
      const { prevPage } = this.meta
      if (!prevPage) return
      this.$eventBus.$emit(`prev${this.id ? ('-' + this.id) : ''}-page`)
    }
  }
}
</script>

<style lang="scss" scoped>
footer {
  display: flex;
  user-select: none;
  justify-content: center;
  align-items: center;
  margin: 1.5rem auto 1rem;

  .controls {
    display: flex;
    align-items: center;

    span {
      border-radius: 4rem;
      padding: .5rem 1.5rem;
      font-size: .8rem;
      margin: 0 .35rem;
      cursor: pointer;

      &.nav {
        background: $primary;
        color: white;

        &.disabled {
          background: $grey;
        }
      }
      &.page-info {
        background: $grey;
        color: $dark;
      }
    }
  }
}
</style>
