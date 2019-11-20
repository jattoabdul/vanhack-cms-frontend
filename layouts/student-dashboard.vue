<template>
  <div class="dashboard layout">
    <div class="sidebar" :class="{ 'open': showSidebarOnMobile === true }">
      <div class="heroshe-logo-wrapper">
        <img class="heroshe-logo" src="/img/logo/heroshe.png" alt="Heroshe">
        <div class="rectangle-line" />
      </div>
      <br>
      <sidebar-nav />
    </div>
    <div class="content-wrapper">
      <!-- layout overflow -->
      <a class="layout-overflow" @click="toggleSidebar" />
      <header-nav :title="headerTitle">
        <template #sidebar-toggle>
          <span class="sidebar-toggle" @click="toggleSidebar">&#9776;</span>
        </template>
      </header-nav>
      <nuxt />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import jwtDecode from 'jwt-decode'
import HeaderNav from '~/components/partials/headernav.vue'
import SidebarNav from '~/components/partials/sidebarnav.vue'

export default {
  middleware: 'authenticated',
  components: {
    HeaderNav,
    SidebarNav
  },
  data() {
    return {
      configs: {},
      showSidebarOnMobile: true
    }
  },
  computed: {
    ...mapGetters({
      headerTitle: 'header/headerTitle'
    })
  },
  beforeMount() {},
  mounted() {},
  methods: {
    toggleSidebar() {
      this.showSidebarOnMobile = !this.showSidebarOnMobile
    }
  }
}
</script>

<style lang="scss" src="./dashboard.scss" scoped />
