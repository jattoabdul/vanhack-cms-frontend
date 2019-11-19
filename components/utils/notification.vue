<template>
  <div :class="`notification ${type} ${customClasses}`">
    <p>
      <!-- <img v-if="type === 'error'" src="/svg/ic-error.svg" alt="error">
      <img v-else-if="type === 'success'" src="/svg/ic-success.svg" alt="success">
      <img v-else src="/svg/ic-info.svg" alt="info"> -->
      <span v-html="content" />
    </p>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    customClasses: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" src="./notification.scss" scoped />
