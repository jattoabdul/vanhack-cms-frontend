<template>
  <nav class="sidebar-nav">
    <ul>
      <li v-for="{ icon, link, title } in navlinks" :key="link">
        <nuxt-link v-if="title.toLowerCase() !== 'home'" :to="link" active-class="active">
          <span class="nav-icon">
            <img :src="`/svg/${icon}`" :alt="title">
          </span>
          {{ title }}
        </nuxt-link>
        <nuxt-link v-else :to="link" exact-active-class="active">
          <span class="nav-icon">
            <img :src="`/svg/${icon}`" :alt="title">
          </span>
          {{ title }}
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
// import { mapActions } from 'vuex'
export default {
  props: {
    adminNav: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      adminNavlinks: [
        {
          icon: 'ic-shipment-box.svg',
          link: '/admin/dashboard/courses',
          title: 'Courses'
        },
        {
          icon: 'ic-currency-dollar-circle.svg',
          link: '/admin/dashboard/students',
          title: 'Students'
        },
        {
          icon: 'ic-group-13.svg',
          link: '/admin/dashboard/teams',
          title: 'Teams'
        },
        {
          icon: 'ic-cog.svg',
          link: '/admin/dashboard/settings',
          title: 'Settings'
        }
      ],
      studentNavlinks: [
        {
          icon: 'ic-house-2.svg',
          link: '/dashboard',
          title: 'Home'
        },
        {
          icon: 'ic-shipment-box.svg',
          link: '/dashboard/shipments',
          title: 'Shipments'
        },
        {
          icon: 'ic-currency-dollar-circle.svg',
          link: '/dashboard/payments',
          title: 'Payments'
        },
        {
          icon: 'ic-group-13.svg',
          link: '/dashboard/customers',
          title: 'Customers'
        },
        {
          icon: 'ic-analytics-board-bars.svg',
          link: '/dashboard/cargo-manifests',
          title: 'Cargo Manifests'
        },
        {
          icon: 'ic-human-resources-search-team.svg',
          link: '/dashboard/team',
          title: 'Team'
        },
        {
          icon: 'ic-cog.svg',
          link: '/dashboard/settings',
          title: 'Settings'
        }
      ]
    }
  },
  computed: {
    navlinks() {
      return this.adminNav ? this.adminNavlinks : this.studentNavlinks
    }
  },
  methods: {}
  // ...mapActions({
  //   unSetToken: 'auth/unSetTokenAction',
  //   resetProfile: 'profile/resetProfileAction'
  // })
}
</script>

<style lang="scss" src="./sidebarnav.scss" scoped />
