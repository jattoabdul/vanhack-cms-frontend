<template>
  <nav :class="`nav-wrapper outer ${customClasses}`">
    <nuxt-link to="/" tag="span">
      <img src="/img/logo/heroshe.png" alt="Heroshe">
    </nuxt-link>
    <span v-if="showSignupAction" class="blue-text">
      <span class="grey-text">New to Heroshe?</span>
      <nuxt-link to="/auth/signup">
        Sign Up
      </nuxt-link>
    </span>
    <span v-else-if="showSigninAction" class="blue-text">
      <span class="grey-text">Already have an account?</span>
      <nuxt-link to="/auth/login">
        Sign In
      </nuxt-link>
    </span>
  </nav>
</template>

<script>
export default {
  props: {
    showSigninAction: {
      type: Boolean,
      default() {
        return false
      }
    },
    showSignupAction: {
      type: Boolean,
      default() {
        return false
      }
    },
    customClasses: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" src="./nav.scss" scoped />
