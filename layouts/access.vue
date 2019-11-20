<template>
  <div class="acess layout">
    <nuxt />
  </div>
</template>

<script>
export default {
  middleware: 'no-auth',
  data() {
    return {}
  },
  beforeMount() {},
  methods: {}
}
</script>

<style lang="scss" src="./access.scss" scoped />
