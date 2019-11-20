<template>
  <div class="error">
    <inner-nav />
    <main>
      <h1 v-if="error.statusCode === 404" class="title">
        The page you’re <br> looking for doesn’t Exist.
      </h1>
      <!-- <h1 v-else-if="[500, 501, 502, 503].includes(error.statusCode)" class="title">
        Oops - An error occurred on our systems. This was not caused by you. Please retry after sometime.
      </h1> -->
      <h1 v-else class="title">
        An Error has Occurred.
      </h1>
      <div class="error-detail">
        <div class="error-item-wrapper">
          <p>Perharps you’re here because</p>
          <ul class="item-list">
            <li>
              <span>
                <img src="/svg/erroritem.svg" alt="error item icon">
              </span>
              <span>The page has moved</span>
            </li>
            <li>
              <span>
                <img src="/svg/erroritem.svg" alt="error item icon">
              </span>
              <span>The page no longer exists</span>
            </li>
            <!-- <li>
              <span>
                <img src="/svg/erroritem.svg" alt="error item icon">
              </span>
              <span>Our Servers are experiencing a downtime</span>
            </li> -->
            <li>
              <span>
                <img src="/svg/erroritem.svg" alt="error item icon">
              </span>
              <span>You were looking for your puppy and got lost</span>
            </li>
            <li>
              <span>
                <img src="/svg/erroritem.svg" alt="error item icon">
              </span>
              <span>You like 404 pages</span>
            </li>
          </ul>
          <nuxt-link tag="button" to="/">
            Return to Home page
          </nuxt-link>
        </div>
        <div class="error-img">
          <img src="/svg/error404.svg" alt="empty cartoon error">
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import InnerNav from '~/components/partials/innernav.vue'

export default {
  head: {
    title: 'Heroshe - Error 404'
  },
  components: {
    InnerNav
  },
  layout: 'dashboard',
  props: {
    error: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="scss" src="./error.scss" scoped />
