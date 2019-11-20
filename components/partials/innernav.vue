<template>
  <nav :class="`nav-wrapper inner ${customClasses}`">
    <div class="links">
      <nuxt-link to="/dashboard" class="link">
        Home
      </nuxt-link>
      <nuxt-link to="/dashboard/shipments" class="link">
        Shipments
      </nuxt-link>
      <nuxt-link to="/dashboard/buy-for-me" class="link">
        Buy For Me
      </nuxt-link>
      <nuxt-link to="/dashboard/payments" class="link">
        Payments
      </nuxt-link>
      <nuxt-link to="/dashboard/settings" class="link">
        Settings
      </nuxt-link>
    </div>
    <div class="widget-links">
      <div class="wallet-widget">
        <span class="wallet-value-wrapper">
          <img src="/svg/wallet.svg" alt="wallet">
          <span class="wallet-value">{{ walletBalance }}</span>
        </span>
        <img src="/svg/ic-info-2.svg" alt="wallet" class="info-icon" :title="`Your Heroshe Wallet Balance is: ${walletBalance}`">
      </div>
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
      </div>
      <div class="other-widget">
        <span class="dropdown-menu-icon">
          <img src="/svg/ic-arrow-drop-down.svg" alt="dropdown" class="icon">
        </span>
        <div class="dropdown">
          <nuxt-link to="/dashboard/settings" tag="span">
            Settings
          </nuxt-link>
          <nuxt-link to="/dashboard/faqs/" tag="span">
            FAQ &amp; Help center
          </nuxt-link>
          <span @click.stop="signout">
            Signout
          </span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
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
  methods: {
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

<style lang="scss" src="./nav.scss" scoped />
