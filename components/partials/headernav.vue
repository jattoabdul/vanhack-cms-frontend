<template>
  <nav :class="`nav-wrapper inner ${customClasses}`">
    <div class="nav-left">
      <slot name="sidebar-toggle">
        <span class="sidebar-toggle">&#9776;</span>
      </slot>
      <div class="title">
        {{ title }} <span class="data-count">{{ pageDataCount ? formatCount(pageDataCount) : '' }}</span>
      </div>
    </div>
    <div class="widget-links">
      <!-- <div class="wallet-widget">
        <span class="wallet-value-wrapper">
          <img src="/svg/wallet.svg" alt="wallet">
          <span class="wallet-value">{{ walletBalance }}</span>
        </span>
        <img src="/svg/ic-info-2.svg" alt="wallet" class="info-icon" :title="`Your Heroshe Wallet Balance is: ${walletBalance}`">
      </div> -->
      <div class="notification-widget" :class="{ notifactive: openNotifBar }">
        <span class="dropdown-menu-icon">
          <img src="/svg/ic-notifications.svg" alt="notices" class="notif-icon">
        </span>
        <!-- <span class="dropdown-menu-icon">
          <img src="/svg/ic-notifications-full.svg" alt="notices" class="notif-icon-not-empty" @click.stop="toggleNotificationBar">
        </span> -->
        <div class="dropdown" :class="{ notif: openNotifBar }">
          <div class="each-notif">
            <h6 class="notif-head">
              <span class="notif-label">New</span>
              <span class="notif-heading">We’ve updated our privacy policy</span>
            </h6>
            <p class="notif-body">
              We’d like to give you a heads up that our privacy policy have been updated to reflect our commitment to…
            </p>
          </div>
        </div>
      </div>
      <div class="profile-widget">
        <img src="/svg/avatar.svg" alt="profile pic" class="profile-icon">
        <span class="profile-name" :title="firstName || ''">
          {{ firstName }}
        </span>
        <div class="dropdown">
          <nuxt-link to="/dashboard/settings" tag="span">
            Settings
          </nuxt-link>
          <span @click.stop="signout">
            Signout
          </span>
        </div>
      </div>
      <!-- <div class="other-widget">
        <span class="dropdown-menu-icon">
          <img src="/svg/ic-arrow-drop-down.svg" alt="dropdown" class="icon">
        </span>
        <div class="dropdown">
          <nuxt-link to="/dashboard/settings" tag="span">
            Settings
          </nuxt-link>
          <span @click.stop="signout">
            Signout
          </span>
        </div>
      </div> -->
    </div>
  </nav>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    title: {
      type: String,
      default: 'Title'
    },
    showWalletBalance: {
      type: Boolean,
      default() {
        return true
      }
    },
    showProfileMenu: {
      type: Boolean,
      default() {
        return true
      }
    },
    customClasses: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pageDataCount: null,
      openNotifBar: false
    }
  },
  computed: {
    firstName() {
      const profile = this.$store.state.profile.me
      if (profile && profile.firstName) return profile.firstName
      return 'Stranger'
    },
    walletBalance() {
      const profile = this.$store.state.profile.me
      if (profile && profile.walletBalance) return profile.walletBalance
      return '$0'
    }
  },
  mounted() {
    this.$eventBus.$on('page-data-count', payload => {
      this.pageDataCount = payload.count
    })
  },
  methods: {
    formatCount(amount, decimalCount = 0, decimal = '.', thousands = ',') {
      try {
        decimalCount = Math.abs(decimalCount)
        decimalCount = isNaN(decimalCount) ? 0 : decimalCount

        const negativeSign = amount < 0 ? '-' : ''

        const i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString()
        const j = (i.length > 3) ? i.length % 3 : 0

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : '')
      } catch (e) {
        return '--'
      }
    },
    signout() {
      // set a global isloading to true and add loader
      this.resetProfile()
      this.unSetToken()
      this.$router.push('/')
    },
    toggleNotificationBar() {
      this.openNotifBar = !this.openNotifBar
    },
    ...mapActions({
      unSetToken: 'auth/unSetTokenAction',
      resetProfile: 'profile/resetProfileAction'
    })
  }
}
</script>

<style lang="scss" src="./headernav.scss" scoped />
