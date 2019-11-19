<template>
  <div class="page">
    <h1 class="heading2">
      Student Signin
    </h1>
</template>

<script>
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
import jwtDecode from 'jwt-decode'
export default {
  layout: 'access',
  components: {
    ScaleLoader
  },
  data() {
    return {
      showPassword: false,
      requesting: false,
      inputArea: {
        client_id: null,
        email: null,
        password: null
      }
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
