<template>
  <div v-show="isActive" class="tab">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isActive: false
    }
  },
  computed: {
    href() {
      return this.url || '#' + this.name.toLowerCase().replace(/ /g, '-')
    }
  },
  mounted() {
    this.isActive = this.selected
  }
}
</script>

<style lang="scss" src="./tab.scss" scoped />
