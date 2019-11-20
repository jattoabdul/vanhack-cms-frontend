<template>
  <div class="page shipment-details">
    <notification
      v-if="isGlobalNotification"
      :type="globalNotificationType"
      :content="globalNotificationMsg"
    />
    <main>
      <div class="top-actions">
        <p class="nav-back" @click="back">
          <img src="/svg/icon-back.svg" alt="back" class="back-icon">
          Shipments
        </p>
        <p class="heading">
          <img src="/svg/printer.svg" alt="print" class="print-icon">
          Print order
        </p>
      </div>
      <div v-if="!requesting" class="shipments-details-container">
        <div v-if="shipment" class="shipments-details">
          <div class="each-shipment">
            <div class="shipment-and-delivery-address">
              <div class="shipment-detail">
                <h6>Shipment details</h6>
                <div class="content">
                  <div class="each-line">
                    <span class="title">Tracking #:</span>
                    <span class="value" v-text="shipment.trackingNo" />
                  </div>
                  <div class="each-line">
                    <span class="title">Weight:</span>
                    <span class="value" v-text="`${shipment.weight} lbs`" />
                  </div>
                  <div class="each-line">
                    <span class="title">Date Created:</span>
                    <span class="value" v-text="shipment.timestamps.createdAt.datePrettyShort" />
                  </div>
                  <div class="each-line">
                    <span class="title">Payment Status:</span>
                    <span
                      class="value label"
                      :class="{ paid: shipment.paymentStatus, unpaid: !shipment.paymentStatus }"
                    >{{ shipment.paymentStatus ? 'Paid' : 'Unpaid' }}</span>
                    <!-- <span
                      class="value label"
                      :class="{ paid: shipment.paymentStatus, unpaid: !shipment.paymentStatus }"
                      @click="gotoPaymentDetailPageForShipment(shipment.paymentStatus, shipment.paymentReference)"
                    >
                      {{ shipment.paymentStatus ? 'Paid' : 'Unpaid' }}
                      <img src="/svg/ic-info-2.svg" alt="view payment detail" title="Click to view payment detail" class="info-icon">
                    </span>-->
                  </div>
                  <div class="each-line">
                    <span class="title">Description:</span>
                    <!-- <span class="value mw12" v-text="shipment.title" /> -->
                    <span class="value mw12" v-text="shipment.info" />
                  </div>
                  <!-- <img src="/svg/eachshipment.svg" alt="ashipment" class="each-shipment-icon">
                  <div class="address-content">
                    <p>Tracking #: <span>{{ shipment.trackingNo }}</span></p>
                    <p>Weight: <span>{{ shipment.weight }}lbs</span></p>
                    <p>Date Created: <span>{{ shipment.timestamps.createdAt.datePrettyShort }}</span></p>
                    <p>Payment Status: <span class="label" :class="{ paid: shipment.paymentStatus, unpaid: !shipment.paymentStatus }">{{ shipment.paymentStatus ? 'Paid' : 'Unpaid' }}</span></p>
                    <p>Title: <span>{{ shipment.title }}</span></p>
                  </div>-->
                </div>
              </div>
              <div />
              <div class="delivery-address">
                <h6>Delivery Address</h6>
                <p>{{ shipment.address.name }}</p>
                <p class="detail">
                  {{ shipment.address.street }}
                  <br>
                  {{ shipment.address.city }}
                  <br>
                  {{ shipment.address.state }}. Nigeria
                </p>
                <br>
                <p>{{ shipment.address.phone }}</p>

                <!-- <p
                  class="change-address-link"
                  @click.stop="openAllAddressesModal(shipment.trackingNo)"
                >
                  Change delivery address
                </p>-->
                <br>
                <div class="customer-details">
                  <h6>Customer Details</h6>
                  <p>{{ shipment.customer.firstName }} {{ shipment.customer.lastName }}</p>
                  <p>{{ shipment.customer.phone }}</p>
                  <p>{{ shipment.customer.email }}</p>
                </div>
              </div>
            </div>
            <div class="divider" />
            <div class="delivery-status">
              <h6>Delivery status</h6>
              <!-- <progress-steps :id="parseInt($route.params.trackingNo)" :status="shipment.status" /> -->
              <br>
              <p>
                <span class="dark-grey-text mr">Estimated delivery date:</span>
                <span v-text="shipment.eta" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Notification from '~/components/utils/notification.vue'
// import ProgressSteps from '~/components/utils/progress-steps.vue'

export default {
  layout: 'dashboard',
  head: {
    title: 'Heroshe - Ops Manager - Shipment details'
  },
  components: {
    Notification
    // ProgressSteps
  },
  data() {
    return {
      perPage: 2,
      requesting: false,
      hasErrorTracker: false,
      globalNotificationMsg: '',
      globalNotificationType: '',
      isGlobalNotification: false,
      trustedCustomer: false,
      shipment: null,
      currentShipmentTrackingNo: null,
      currentSelectedShipmentAdress: null
    }
  },
  computed: {},
  asyncData({ query }) {
    const { trackingNo } = query
    // const trackingNos = trackingNo.split(',')
    return {
      trackingNo
    }
  },
  created() {
    const { trackingNo } = this
    if (!trackingNo) {
      return
    }
    this.fetchData()
  },
  mounted() {
    this.setHeaderTitle('Shipment details')
    this.$eventBus.$emit('page-data-count', { count: null })
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
    async fetchData() {
      const { token } = this.$store.state.auth
      const dataUrl = `/shipments/${this.trackingNo}`
      this.requesting = true
      try {
        const queryUrl = `/api${dataUrl}`
        const { data, status } = await this.$axios(queryUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (status === 200) {
          this.shipment = data.payload.shipment
          // this.paystackToken = data.payload.token
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
      setHeaderTitle: 'header/setHeaderTitleAction'
    })
  }
}
</script>

<style lang="scss" src="./details.scss" scoped />
