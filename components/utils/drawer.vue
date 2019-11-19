<template>
  <div :id="id" class="drawer" @click="closeDrawer">
    <div class="drawer-body" :class="`${customClasses}`" @click.stop>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: 'drawer'
    },
    customClasses: {
      type: String,
      default: ''
    },
    cannotclickout: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeDrawer() {
      if (this.cannotclickout) {
        return false
      } else {
        this.$eventBus.$emit(`close-${this.id}-drawer`)
      }
    }
  }
}
</script>

<style lang="scss" src="./drawer.scss" scoped />
