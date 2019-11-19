<template>
  <div class="page">
    <h1 class="heading2">
      Student Signin
    </h1>
  </div>
</template>

<script>
export default {
  // layout: 'access',
  components: {},
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
