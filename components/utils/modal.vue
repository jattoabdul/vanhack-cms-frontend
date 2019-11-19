<template>
  <div :id="id" class="modal" @click="closeModal">
    <div class="modal-body" :class="`${size} ${customClasses}`" @click.stop>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: 'modal'
    },
    size: {
      type: String,
      default: 'small'
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
    closeModal() {
      if (this.cannotclickout) {
        return false
      } else if (this.id === 'modal') {
        this.$eventBus.$emit('close-modal')
      } else {
        this.$eventBus.$emit(`close-${this.id}-modal`)
      }
    }
  }
}
</script>

<style lang="scss" src="./modal.scss" scoped />
