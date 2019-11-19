<template>
  <div class="page">
    <h1 class="heading2">
      Sign in to the Admin Panel
    </h1>
  </div>
</template>

<script>
// import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
export default {
  // layout: 'admin-access',
  components: {
    // ScaleLoader
  },
  data() {
    return {
      showPassword: false,
      requesting: false,
    }
  },
  computed: {
    passwordField() {
      if (this.showPassword) {
        return 'text'
      } else {
        return 'password'
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss" src="./auth.scss" scoped />
