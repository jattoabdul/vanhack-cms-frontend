<template>
  <div class="page login">
    <notification v-if="isGlobalNotification" :type="globalNotificationType" :content="globalNotificationMsg" />
    <main>
      <div class="auth-wrapper">
        <h1 class="title-text">
          Welcome to Vanhack <br> Class Management System
        </h1>
        <p class="sub-text dark-grey-text">
          Enter your login details to access your account
        </p>
        <form class="grid login-form-wrapper" @submit.prevent="login">
          <div class="form-field" :class="{ error: inputArea.email.hasError }">
            <span class="raised-label" :class="{ live: inputArea.email.label }">
              Email address
            </span>
            <input
              id="email_login"
              v-model="inputArea.email.value"
              name="password_login"
              type="email"
              placeholder="Email address"
              required
              @focus="inputArea.email.label = true"
              @blur="validateEmailAddress()"
              @input="clearInputError('email')"
            >
            <span class="error-text">
              <span>{{ inputArea.email.errorMsg }}</span>
            </span>
          </div>

          <div class="form-field with-control" :class="{ error: inputArea.password.hasError }">
            <span class="raised-label" :class="{ live: inputArea.password.label }">
              Password
            </span>
            <input
              id="password_login"
              v-model="inputArea.password.value"
              name="password_login"
              :type="passwordField"
              placeholder="Password"
              required
              @focus="inputArea.password.label = true"
              @input="clearInputError('password')"
            >
            <span v-if="!showPassword" class="view-control show-text" @click="showPassword = true">
              show
            </span>
            <span v-if="showPassword" class="view-control hide-text" @click="showPassword = false">
              hide
            </span>
            <span class="error-text">
              <span>{{ inputArea.password.errorMsg }}</span>
            </span>
          </div>

          <!-- action-btn and requesting loader -->
          <div v-if="requesting" class="form-field wide auth-action-loading-wrapper">
            <scale-loader color="#33cccd" />
          </div>
          <button v-else-if="hasErrorTracker" v-ripple="'rgba(255, 255, 255, 0.3)'" class="auth-action-btn" type="submit" disabled>
            Login
          </button>
          <button v-else v-ripple="'rgba(255, 255, 255, 0.3)'" class="auth-action-btn" type="submit">
            Login
          </button>
        </form>

        <p class="alt dark-grey-text">
          Don’t have an account yet?
          <nuxt-link class="blue-text" tag="span" to="/auth/signup">
            Signup
          </nuxt-link>
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
// import jwtDecode from 'jwt-decode'
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
import Notification from '~/components/utils/notification.vue'

export default {
  layout: 'access',
  head: {
    title: 'Vanhack - Class Management System - Login'
  },
  components: {
    ScaleLoader,
    Notification
  },
  data() {
    return {
      showPassword: false,
      requesting: false,
      hasErrorTracker: false,
      globalNotificationMsg: '',
      globalNotificationType: '',
      isGlobalNotification: false,
      inputArea: {
        email: {
          value: null,
          label: false,
          hasError: false,
          errorMsg: null
        },
        password: {
          value: null,
          label: false,
          hasError: false,
          errorMsg: null
        }
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
  methods: {
    clearInputError(inputField) {
      this.inputArea[inputField].hasError = false
      this.inputArea[inputField].errorMsg = null
    },
    clearGlobalNotification() {
      this.isGlobalNotification = false
      this.globalNotificationMsg = ''
      this.globalNotificationType = ''
    },
    setGlobalNotification(type = '', message = '') {
      this.isGlobalNotification = true
      this.globalNotificationMsg = message
      this.globalNotificationType = type

      setTimeout(() => {
        this.clearGlobalNotification()
      }, 6000)
    },
    validateEmailAddress() {
      this.inputArea.email.label = false

      const email = this.inputArea.email.value || ''

      if (!email.trim().length) return

      // eslint-disable-next-line
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(email).toLowerCase())) {
        this.hasErrorTracker = true
        this.inputArea.email.hasError = true
        this.inputArea.email.errorMsg = 'Please enter a valid e-mail address'
        return re.test(String(email).toLowerCase())
      }
      this.hasErrorTracker = false
    },
    async login() {
      this.requesting = true
      try {
        // make api call 2 Create Profile of user value inputed so far
        const { data, status } = await this.$axios.post('/api/auth/login', {
          password: this.inputArea.password.value,
          email: this.inputArea.email.value
        })
        if (status === 200) {
          // set token and route to dashboard page below this line
          const { token } = data.payload
          this.setToken(token)

          // fetch the user profile from db and set to store
          const {
            data: accountProfileData,
            status: profileStatus
          } = await this.$axios.get('/api/accounts/student/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          if (profileStatus === 200 && accountProfileData) {
            this.setProfile(accountProfileData.payload.account)
          }
          this.$router.push('/dashboard/')
          this.requesting = false
        }
      } catch (error) {
        if ([500, 501, 502, 503].includes(error.statusCode)) {
          this.setGlobalNotification(
            'error',
            'Oops - An error occurred on our systems. This was not caused by you. Please retry after sometime.'
          )
        } else {
          this.setGlobalNotification(
            'error',
            `${error.response ? error.response.data.msg : error.message}`
          )
        }
        this.requesting = false
      }
    },
    ...mapActions({
      setToken: 'auth/setTokenAction',
      setProfile: 'profile/setProfileAction'
    })
  }
}
</script>

<style lang="scss" src="./auth.scss" scoped />
