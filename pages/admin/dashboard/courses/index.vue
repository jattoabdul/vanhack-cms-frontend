<template>
  <div class="page shipments">
    <notification v-if="isGlobalNotification" :type="globalNotificationType" :content="globalNotificationMsg" />
    <main>
      <div class="shipments-wrapper">
        <courses-data-table
          data-url="/admin/events"
          data-to-pull="events"
          :per-page="perPage"
          :headings="cardHeadings"
        />
      </div>
    </main>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Notification from '~/components/utils/notification.vue'
import CoursesDataTable from '~/components/utils/courses-data-table.vue'

export default {
  layout: 'dashboard',
  head: {
    title: 'Vanhack - Class Management System - Courses'
  },
  components: {
    Notification,
    CoursesDataTable
  },
  data() {
    return {
      perPage: 20,
      requesting: false,
      hasErrorTracker: false,
      globalNotificationMsg: '',
      globalNotificationType: '',
      isGlobalNotification: false,
      cardHeadings: [
        { name: 'Course Name', key: 'name' },
        { name: 'Description', key: 'desc' },
        { name: 'Status', key: 'status' },
        { name: 'Date', key: 'createdAt' }
      ]
    }
  },
  computed: {},
  mounted() {
    this.setHeaderTitle('Courses')
    this.$eventBus.$on('set-notification', payload => this.setGlobalNotification(payload.type, payload.msg))
  },
  beforeDestroy() {
    this.$eventBus.$off('set-notification')
  },
  methods: {
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
    ...mapActions({
      setHeaderTitle: 'header/setHeaderTitleAction'
    })
  }
}
</script>

<style lang="scss" src="./courses.scss" scoped />
