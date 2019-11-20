<template>
  <div class="data-table">
    <div v-if="requesting" class="no-content-dual">
      <content-placeholders>
        <content-placeholders-text :lines="1" />
      </content-placeholders>
      <content-placeholders>
        <content-placeholders-text :lines="1" />
      </content-placeholders>
    </div>
    <div v-else class="top-controls">
      <div class="group">
        <div class="dropdown white-bg sort-dropdown dropdown-primary mr">
          <img class="drop-icon drop-icon-left" src="/svg/ic-arrow-drop-down.svg" alt="drop">
          <span class="drop-text inverse">Actions</span>
          <div class="dropdown-wrapper">
            <div class="dropdown-options">
              <span v-ripple="configs.actionRipple" @click="openBulkUpdateStatusModal()" v-text="'Update Status'" />
            </div>
          </div>
        </div>
        <div class="refresh-wrapper">
          <img
            src="/svg/refresh-button.svg"
            class="refresh-btn"
            alt="refresh"
            @click="refreshData()"
          >
        </div>
      </div>
      <div class="group spacing" />
      <div class="group inverse">
        <div class="search mr">
          <img
            src="/svg/search-grey.svg"
            alt="search"
            @click="search()"
          >
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search"
            @search="checkSearchQueryExists"
            @keypress.enter="search()"
          >
        </div>
        <button type="button" class="pay-selected-btn" @click.stop="createShipmentDrawerActive = true">
          Create Event
        </button>
        <!-- Create Shipment Form Drawer -->
        <drawer v-if="createShipmentDrawerActive" id="create-shipment">
          <div class="drawer-heading">
            <h4 class="title">
              Create Event
            </h4>
            <a class="close" href="javascript:;" role="button" @click="closeCreateShipment">&times;</a>
          </div>
          <div class="drawer-content">
            <form @submit.prevent="createNewShipment">
              <div class="form-field" :class="{ error: inputArea.trackingNo.hasError }" @focusin="customerListIsOpen = false">
                <span class="raised-label" :class="{ live: inputArea.trackingNo.label }">
                  Tracking Number
                </span>
                <input
                  id="trackingNo"
                  v-model="inputArea.trackingNo.value"
                  type="text"
                  name="trackingNo"
                  placeholder="Scan or Type in a Tracking Number"
                  autofocus
                  @focus="inputArea.trackingNo.label = true"
                  @blur="inputArea.trackingNo.label = false"
                  @input="clearInputError('trackingNo')"
                >
                <span class="error-text">
                  <span>{{ inputArea.trackingNo.errorMsg }}</span>
                </span>
              </div>
              <!-- START autocomplete customer name typeahead -->
              <div class="form-field dropdown-form" :class="{ error: inputArea.customerName.hasError }">
                <span class="raised-label" :class="{ live: inputArea.customerName.label }">
                  Customer Name
                </span>
                <input
                  id="customerName"
                  ref="customer_name"
                  v-model="inputArea.customerName.value"
                  name="customerName"
                  type="text"
                  placeholder="Customer Name"
                  title="Type and Select a Customer Name from list"
                  required
                  autocomplete="off"
                  @focus="inputArea.customerName.label = true"
                  @blur="inputArea.customerName.label = false"
                  @input="onChangeCustomerName"
                  @keyup.down="onArrowDown"
                  @keyup.up="onArrowUp"
                  @keyup.enter="onEnter"
                >
                <ul v-show="customerListIsOpen" id="customers" class="dropdown-options-wrapper" @focusout="handleClickOutside">
                  <li
                    v-if="requestingCustomerLists"
                    class="loading"
                  >
                    Loading results...
                  </li>
                  <li
                    v-for="(customer, customerIndex) in customerListResults"
                    v-else
                    :key="customerIndex"
                    class="an-option"
                    :class="{ 'is-active': customerIndex === arrowCounter }"
                    @click.stop="setResult(customer)"
                  >
                    {{ `${customer.firstName} ${customer.lastName}` }}
                  </li>
                </ul>
                <span class="error-text">
                  <span>{{ inputArea.customerName.errorMsg }}</span>
                </span>
              </div>
              <!-- END autocomplete customer name typeahead -->
              <div class="form-field" :class="{ error: inputArea.weight.hasError }" @focusin="customerListIsOpen = false">
                <span class="raised-label" :class="{ live: inputArea.weight.label }">
                  Weight
                </span>
                <input
                  id="weight"
                  v-model="inputArea.weight.value"
                  type="text"
                  name="weight"
                  placeholder="Weight"
                  min="0"
                  pattern="^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$"
                  required
                  @focus="inputArea.weight.label = true"
                  @blur="inputArea.weight.label = false"
                  @input="clearInputError('weight')"
                >
                <span class="error-text">
                  <span>{{ inputArea.weight.errorMsg }}</span>
                </span>
              </div>
              <div class="form-field" @focusin="customerListIsOpen = false">
                <select
                  v-model="inputArea.shippingGroup.value"
                  name="shippingGroup"
                  required
                >
                  <option :value="null" selected disabled>
                    Select Shipping group
                  </option>
                  <option v-for="(group, groupIndex) in shippingGroups" :key="groupIndex" :value="group._id">
                    {{ group.name }}
                  </option>
                </select>
              </div>
              <div class="form-field" @focusin="customerListIsOpen = false">
                <select
                  v-model="inputArea.cratingGroup.value"
                  name="cratingGroup"
                >
                  <option :value="null" selected disabled>
                    Select Crating group
                  </option>
                  <option v-for="(group, groupIndex) in cratingGroups" :key="groupIndex" :value="group._id">
                    {{ group.name }}
                  </option>
                </select>
              </div>
              <div class="form-field lh" :class="{ error: inputArea.info.hasError }" @focusin="customerListIsOpen = false">
                <span class="raised-label" :class="{ live: inputArea.info.label }">
                  Description
                </span>
                <textarea
                  id="info"
                  v-model="inputArea.info.value"
                  type="text"
                  name="info"
                  placeholder="Description"
                  required
                  @focus="inputArea.info.label = true"
                  @blur="inputArea.info.label = false"
                  @input="clearInputError('info')"
                />
                <span class="error-text">
                  <span>{{ inputArea.info.errorMsg }}</span>
                </span>
              </div>
              <br>
              <div class="flex-space-between">
                <button type="button" class="inverse" @click="closeCreateShipment">
                  Cancel
                </button>
                <button type="submit" class="longer">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </drawer>
        <!-- Shipment Detail Drawer -->
        <drawer v-if="shipmentDetailsDrawerActive" id="shipment-details">
          <div class="drawer-heading">
            <h4 class="title">
              Shipment Details
            </h4>
            <a class="close" href="javascript:;" role="button" @click="shipmentDetailsDrawerActive = false">&times;</a>
          </div>
          <div class="drawer-content">
            <div class="drawer-data">
              <div class="mb-md">
                <div class="dark-grey-text">
                  Customer name
                </div>
                <div class="right-align" v-text="activeShipment.customerName" />
              </div>
              <div class="mb-md">
                <div class="dark-grey-text">
                  Tracking #
                </div>
                <div class="right-align force-select" v-text="activeShipment.trackingNo" />
              </div>
              <div class="mb-md">
                <div class="dark-grey-text">
                  Weight
                </div>
                <div class="right-align" v-text="`${activeShipment.weight} lbs`" />
              </div>
              <div class="mb-md">
                <div class="dark-grey-text">
                  Description
                </div>
                <div class="right-align" v-text="activeShipment.info" />
              </div>
              <div class="mb-md">
                <div class="dark-grey-text">
                  Payment Status
                </div>
                <div class="right-align">
                  <span class="label" :class="{ completed: activeShipment.paymentStatus }" v-text="activeShipment.paymentStatus ? 'Paid' : 'Unpaid'" />
                </div>
              </div>
              <div class="mb-md">
                <div class="dark-grey-text">
                  Shipment Status
                </div>
                <div class="right-align">
                  <span class="label" :class="activeShipment.status" v-text="activeShipment.status" />
                </div>
              </div>
              <div class="mb-md">
                <div class="dark-grey-text">
                  Date
                </div>
                <div class="right-align" v-text="activeShipment.timestamps.createdAt.datePrettyShort || ''" />
              </div>
              <div class="mb-md">
                <h4 class="sub-panel-title">
                  Delivery Address
                </h4>
              </div>
              <div class="mb-md">
                <div class="dark-grey-text">
                  Name
                </div>
                <div class="right-align" v-text="activeShipment.address.name" />
              </div>
              <div class="mb-md">
                <div class="dark-grey-text">
                  Street
                </div>
                <div class="right-align" v-text="activeShipment.address.street" />
              </div>
              <div class="mb-md">
                <div class="dark-grey-text">
                  City
                </div>
                <div class="right-align" v-text="activeShipment.address.city" />
              </div>
              <div class="mb-md">
                <div class="dark-grey-text">
                  State
                </div>
                <div class="right-align" v-text="activeShipment.address.state" />
              </div>
              <div class="mb-md">
                <div class="dark-grey-text">
                  Country
                </div>
                <div class="right-align" v-text="'Nigeria'" />
              </div>
              <div class="mb-md">
                <div class="dark-grey-text">
                  Additional Info
                </div>
                <div class="right-align" v-text="activeShipment.address.additionalInfo" />
              </div>
              <br>
              <div class="flex-flex-end">
                <button type="button" class="longer" @click="gotoShipmentDetailPage([activeShipment.trackingNo])">
                  View Detail
                </button>
              </div>
            </div>
          </div>
        </drawer>
        <!-- Update Status Success Drawer Modal -->
        <drawer v-if="updateStatusSuccessModal" id="update-success-success" class="as-modal for-notification">
          <div class="drawer-content centered">
            <div class="success-icon-wrapper">
              <img src="/svg/ic-success-check.svg" width="50" height="50" alt="success check icon">
            </div>
            <div class="success-title">
              All done!
            </div>
            <div class="success-message">
              The status has been changed successfully
            </div>
            <button type="button" class="inverse" @click="updateStatusSuccessModal = false">
              Close
            </button>
          </div>
        </drawer>
        <!-- Update Status Drawer Modal -->
        <drawer v-if="updateStatusModalActive" id="update-status" class="as-modal">
          <div class="drawer-heading">
            <h4 class="title">
              Update Status
            </h4>
            <a class="close" href="javascript:;" role="button" @click="closeUpdateStatusModal(false)">&times;</a>
          </div>
          <div class="drawer-content">
            <form @submit.prevent="updateStatus">
              <div class="form-field">
                <select v-model="updateShipmentTo" name="shipmentstatus" class="form-input-select">
                  <option :value="null" selected>
                    All
                  </option>
                  <option value="received">
                    Recieved
                  </option>
                  <option value="prepacking">
                    Pre Packing
                  </option>
                  <option value="crating">
                    Crating
                  </option>
                  <option value="packing">
                    Packing
                  </option>
                  <option value="shipped">
                    Shipped
                  </option>
                  <option value="arrived">
                    Arrived
                  </option>
                  <option value="delivery">
                    Out for delivery
                  </option>
                  <option value="delivered">
                    Delivered
                  </option>
                </select>
              </div>
              <br>
              <div class="flex-space-between">
                <button type="button" class="inverse" @click="closeUpdateStatusModal(false)">
                  Close
                </button>
                <button type="submit" class="longer small-text">
                  Update status
                </button>
              </div>
            </form>
          </div>
        </drawer>
        <!-- Edit Shipment Form Drawer -->
        <drawer v-if="editShipmentDrawerActive" id="edit-shipment">
          <div class="drawer-heading">
            <h4 class="title">
              Edit Shipment
            </h4>
            <a class="close" href="javascript:;" role="button" @click="closeEditShipment">&times;</a>
          </div>
          <div class="drawer-content">
            <form @submit.prevent="editShipment">
              <div class="form-field" :class="{ error: inputArea.trackingNo.hasError }">
                <span class="raised-label" :class="{ live: inputArea.trackingNo.label }">
                  Tracking Number
                </span>
                <input
                  id="trackingNo"
                  v-model="inputArea.trackingNo.value"
                  type="text"
                  name="trackingNo"
                  placeholder="Tracking Number"
                  @focus="inputArea.trackingNo.label = true"
                  @blur="inputArea.trackingNo.label = false"
                  @input="clearInputError('trackingNo')"
                >
                <span class="error-text">
                  <span>{{ inputArea.trackingNo.errorMsg }}</span>
                </span>
              </div>
              <div class="form-field" :class="{ error: inputArea.customerName.hasError }">
                <span class="raised-label" :class="{ live: inputArea.customerName.label }">
                  Customer Name
                </span>
                <input
                  id="customerName"
                  ref="customer_name"
                  v-model="inputArea.customerName.value"
                  name="customerName"
                  type="text"
                  placeholder="Customer Name"
                  disabled
                  @focus="inputArea.customerName.label = true"
                  @blur="inputArea.customerName.label = false"
                >
                <span class="error-text">
                  <span>{{ inputArea.customerName.errorMsg }}</span>
                </span>
              </div>
              <div class="form-field" :class="{ error: inputArea.weight.hasError }">
                <span class="raised-label" :class="{ live: inputArea.weight.label }">
                  Weight
                </span>
                <input
                  id="weight"
                  v-model="inputArea.weight.value"
                  type="text"
                  name="weight"
                  placeholder="Weight"
                  min="0"
                  pattern="^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$"
                  required
                  @focus="inputArea.weight.label = true"
                  @blur="inputArea.weight.label = false"
                  @input="clearInputError('weight')"
                >
                <span class="error-text">
                  <span>{{ inputArea.weight.errorMsg }}</span>
                </span>
              </div>
              <div class="form-field">
                <select
                  v-model="inputArea.shippingGroup.value"
                  name="shippingGroup"
                  required
                >
                  <option :value="null" selected disabled>
                    Select Shipping group
                  </option>
                  <option v-for="(group, groupIndex) in shippingGroups" :key="groupIndex" :value="group._id">
                    {{ group.name }}
                  </option>
                </select>
              </div>
              <div class="form-field">
                <select
                  v-model="inputArea.cratingGroup.value"
                  name="cratingGroup"
                >
                  <option :value="null" selected disabled>
                    Select Crating group
                  </option>
                  <option v-for="(group, groupIndex) in cratingGroups" :key="groupIndex" :value="group._id">
                    {{ group.name }}
                  </option>
                </select>
              </div>
              <div class="form-field lh" :class="{ error: inputArea.info.hasError }">
                <span class="raised-label" :class="{ live: inputArea.info.label }">
                  Description
                </span>
                <textarea
                  id="info"
                  v-model="inputArea.info.value"
                  type="text"
                  name="info"
                  placeholder="Description"
                  required
                  @focus="inputArea.info.label = true"
                  @blur="inputArea.info.label = false"
                  @input="clearInputError('info')"
                />
                <span class="error-text">
                  <span>{{ inputArea.info.errorMsg }}</span>
                </span>
              </div>
              <br>
              <div class="flex-space-between">
                <button type="button" class="inverse" @click="closeEditShipment">
                  Cancel
                </button>
                <button type="submit" class="longer">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </drawer>
      </div>
    </div>
    <div class="table" :class="{ loading: requesting }">
      <!-- tables heading shimmer -->
      <div v-if="requesting" class="no-content-head">
        <content-placeholders>
          <content-placeholders-heading />
        </content-placeholders>
      </div>

      <!-- tables heading -->
      <div v-else class="th small-gap" :style="{ gridTemplateColumns: `3rem 2fr 2fr repeat(2, 1fr) 5rem` }">
        <span class="cell check-cell">
          <input v-model="selectAll" type="checkbox">
        </span>
        <span v-for="(heading, headingIndex) in headings" :key="headingIndex" class="cell" :class="heading.key" v-text="heading.name" />
      </div>

      <!-- tables body loading shimmer -->
      <div v-if="requesting" class="no-content-body">
        <content-placeholders>
          <content-placeholders-text :lines="12" />
        </content-placeholders>
      </div>

      <!-- tables body no content display -->
      <div v-else-if="!tableData.length" class="no-content">
        <p>{{ loaderText }}</p>
      </div>

      <!-- tables body content -->
      <div
        v-for="(row, rowIndex) in tableData"
        v-else
        :key="rowIndex"
        class="tr small-gap"
        :style="{ gridTemplateColumns: `3rem 2fr 2fr repeat(2, 1fr) 5rem` }"
        @click.stop="openShipmentDetailsDrawer(row)"
      >
        <span class="cell check-cell" @click.stop>
          <!-- v-if="!row.paymentStatus" -->
          <input
            :id="row._id"
            v-model="selected"
            :value="row._id"
            :sector="row._id"
            type="checkbox"
          >
        </span>
        <!-- <span class="cell" v-text="row.id ? `SHM${row.id}` : '--'" /> -->
        <span class="cell overflow ellipsis" :title="row.customerName ? row.customerName : '--'" v-text="row.customerName ? row.customerName : '--'" />
        <span class="cell overflow ellipsis force-select" :title="row.trackingNo ? row.trackingNo : '--'" v-text="row.trackingNo ? row.trackingNo : '--'" />
        <span class="cell" v-text="row.weight ? row.weight : '--'" />
        <span class="cell overflow ellipsis" :title="row.info ? row.info : '--'" v-text="row.info ? row.info : '--'" />
        <span class="cell">
          <span class="label" :class="{ completed: row.paymentStatus }" v-text="row.paymentStatus ? 'Paid' : 'Unpaid'" />
        </span>
        <span class="cell">
          <span class="label" v-text="row.status ? row.status : '--'" />
        </span>
        <!-- <span class="cell center-align" v-text="row.amount ? `$${row.amount}` : '--'" /> -->
        <span class="cell" v-text="row.timestamps.createdAt.datePrettyShort ? row.timestamps.createdAt.datePrettyShort : '--'" />
        <!-- <span class="cell" v-text="row.createdAt ? row.createdAt : '--'" /> -->
        <span class="cell actions">
          <div class="dropdown white-bg sort-dropdown more-actions">
            <img src="/svg/ic-more-vert.svg" alt="more">
            <div class="dropdown-wrapper">
              <div class="dropdown-options">
                <span v-ripple="configs.actionRipple" @click.stop="openEditShipmentDrawer(row)" v-text="'Edit Shipment'" />
                <span v-ripple="configs.actionRipple" @click.stop="openUpdateStatusModal(row)" v-text="'Update Status'" />
              </div>
            </div>
          </div>
        </span>
      </div>

      <!-- table footer -->
      <div v-if="tableData.length && (configs.meta.totalRows <= perPage)" class="tr small-gap sub-pagination" :style="{ gridTemplateColumns: `1fr` }">
        <span class="cell">
          Showing {{ configs.meta.totalRows }} of {{ configs.meta.totalRows }} results
        </span>
      </div>
    </div>
    <!-- tables pagination shimmer -->
    <div v-if="requesting" class="no-content-footer">
      <content-placeholders>
        <content-placeholders-text :lines="1" />
      </content-placeholders>
    </div>
    <!-- tables pagination content -->
    <div v-else-if="tableData.length && !(configs.meta.totalRows <= perPage)" class="footer-content">
      <div class="pagination">
        <span class="prev" :class="{ active: configs.meta.prevPage }" @click="prevPage">
          <img src="/svg/left-arrow.svg" alt="prev">
        </span>
        <span class="numbering">Page <span class="currentPage">{{ currentPage }}</span> of {{ totalPages }}</span>
        <span class="next" :class="{ active: configs.meta.nextPage }" @click="nextPage">
          <img src="/svg/right-arrow.svg" alt="next">
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Drawer from '~/components/utils/drawer.vue'

export default {
  components: {
    Drawer
  },
  props: {
    actions: {
      type: Array,
      default() {
        return [
          { name: 'Pay now' }
        ]
      }
    },
    dataUrl: {
      type: String,
      default: ''
    },
    perPage: {
      type: Number,
      default: 20
    },
    dataToPull: {
      type: String,
      default() {
        return ''
      }
    },
    headings: {
      type: Array,
      default() {
        return []
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      createShipmentDrawerActive: false,
      editShipmentDrawerActive: false,
      shipmentDetailsDrawerActive: false,
      changeOwnershipModalActive: false,
      changeOwnershipSuccessModal: false,
      updateStatusModalActive: false,
      updateStatusSuccessModal: false,
      paymentStatusCheckerModal: false,
      changeDeliveryAddressModalActive: false,
      changeDeliveryAddressSuccessModal: false,
      activeShipment: {},
      updateShipmentTo: null,
      addresses: [], // activeShipment selected Customer Addresses
      requestingAddresses: false,
      requestingTracking: false,
      selectedAddress: {},
      searchQuery: '',
      bulkCheck: false,
      selected: [],
      configs: {
        actionRipple: 'rgba(4, 33, 33, 0.5)',
        meta: {},
        currentPage: 1,
        currentSearchPage: 1
      },
      shippingLabelShipments: [],
      filterShipments: {
        status: null,
        payment_status: null
      },
      inputArea: {
        trackingNo: {
          value: null,
          label: false,
          hasError: false,
          errorMsg: null
        },
        customerName: {
          value: null,
          label: false,
          hasError: false,
          errorMsg: null
        },
        weight: {
          value: null,
          label: false,
          hasError: false,
          errorMsg: null
        },
        shippingGroup: {
          value: null,
          label: false,
          hasError: false,
          errorMsg: null
        },
        cratingGroup: {
          value: null,
          label: false,
          hasError: false,
          errorMsg: null
        },
        info: {
          value: null,
          label: false,
          hasError: false,
          errorMsg: null
        }
      },
      newShipmentOwner: {
        value: null,
        label: false,
        hasError: false,
        errorMsg: null
      },
      currentShipmentOwner: {
        value: null,
        label: false,
        hasError: false,
        errorMsg: null
      },
      scannedTrackingNo: {
        value: null,
        label: false,
        hasError: false,
        errorMsg: null,
        status: false,
        statusType: ''
      },
      cratingGroups: [],
      shippingGroups: [],
      tableRawData: [],
      customerListResults: [],
      customerListIsOpen: false,
      selectedCustomerId: null,
      requestingCustomerLists: false,
      arrowCounter: 0,
      loaderText: 'Loading Data...',
      // ApiUrl: process.env.ApiUrl,
      requesting: false
    }
  },
  computed: {
    tableData() {
      // gives room for manipulation of data based on internal and external conditions/parameters
      if (this.tableRawData.length) return this.tableRawData
      if (this.dataUrl === '') return this.data
      return []
    },
    fromPage() {
      return ((this.configs.meta.currentPage - 1) * this.perPage) + 1
    },
    currentPage() {
      return this.configs.meta.currentPage
    },
    toPage() {
      const result = this.configs.meta.currentPage * this.perPage
      if (result > this.configs.meta.totalRows) return this.configs.meta.totalRows
      return result
    },
    totalPages() {
      if (this.configs.meta.totalPages === 0) return 1
      return this.configs.meta.totalPages
    },
    selectAll: {
      get() {
        return this.selected.length === this.tableData.length
      },
      set(value) {
        this.selected = []

        if (value) {
          this.tableData.forEach((select) => {
            this.selected.push(select._id)
          })
        }
      }
    },
    canPaySelected() {
      return this.selected.length <= 0
    }
  },
  watch: {
    bulkCheck: function (val) {
      if (val) {
        this.tableRawData = this.tableData.map(td => {
          td.checked = true
          return td
        })
      } else {
        this.tableRawData = this.tableData.map(td => {
          td.checked = false
          return td
        })
      }
    }
  },
  mounted() {
    this.$eventBus.$on('refresh-table', _ => this.fetchData())
    this.$eventBus.$on('close-edit-shipment-drawer', payload => {
      this.editShipmentDrawerActive = false
    })
    this.$eventBus.$on('close-shipment-details-drawer', payload => {
      this.shipmentDetailsDrawerActive = false
    })
    this.$eventBus.$on('close-shipment-details-drawer', payload => {
      this.shipmentDetailsDrawerActive = false
    })
    this.$eventBus.$on('close-change-ownership-drawer', payload => {
      this.changeOwnershipModalActive = false
      this.selected = []
      this.selectedCustomerId = null
      this.newShipmentOwner.value = null
      this.activeShipment = null
      this.changeOwnershipSuccessModal = false
    })
    this.$eventBus.$on('close-change-ownership-success-drawer', payload => {
      this.changeOwnershipSuccessModal = false
    })
    this.$eventBus.$on('close-update-status-drawer', payload => {
      this.activeShipment = null
      this.selected = []
      this.updateStatusModalActive = false
      this.updateStatusSuccessModal = false
    })
    this.$eventBus.$on('close-update-status-success-drawer', payload => {
      this.updateStatusSuccessModal = false
    })
    this.$eventBus.$on('close-change-delivery-address-drawer', payload => {
      this.activeShipment = null
      this.selected = []
      this.selectedAddress = {}
      this.selectedCustomerId = null
      this.changeDeliveryAddressModalActive = false
      this.changeDeliveryAddressSuccessModal = false
    })
    this.$eventBus.$on('close-change-delivery-address-success-drawer', payload => {
      this.changeDeliveryAddressSuccessModal = false
    })
    this.$eventBus.$on('close-payment-status-checker-drawer', payload => {
      this.paymentStatusCheckerModal = false
    })
  },
  beforeDestroy() {
    this.$eventBus.$off('refresh-table')
    this.$eventBus.$off('close-edit-shipment-drawer')
    this.$eventBus.$off('close-shipment-details-drawer')
    this.$eventBus.$off('close-change-ownership-drawer')
    this.$eventBus.$off('close-change-ownership-success-drawer')
    this.$eventBus.$off('close-payment-status-checker-drawer')
  },
  created() {
    const { dataUrl } = this
    if (!dataUrl) {
      return
    }
    this.fetchData()
  },
  methods: {
    emitSetGlobalNotification(type, msg) {
      this.$eventBus.$emit('set-notification', { type, msg })
    },
    async fetchData(filterQuery = '') {
      const { token } = this.$store.state.auth
      const { dataUrl, dataToPull, perPage } = this
      this.requesting = true
      try {
        let queryUrl = `/api${dataUrl}`

        if (this.searchQuery.length > 0) {
          queryUrl = `${queryUrl}/search?query=${this.searchQuery}&per_page=${perPage}&page=${this.configs.currentSearchPage}`
        } else {
          queryUrl = `${queryUrl}?per_page=${perPage}&page=${this.configs.currentPage}`
        }

        if (filterQuery.length > 0) {
          queryUrl += filterQuery
        }

        const { data } = await this.$axios(queryUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const tableRawData = data.payload[dataToPull]
        const { meta } = data.payload
        if (tableRawData.length) {
          this.tableRawData = tableRawData
          this.configs.meta = meta
          this.$eventBus.$emit('page-data-count', { count: this.configs.meta.totalRows })
        } else {
          this.tableRawData = []
          this.loaderText = 'No Data To Be Displayed'
          this.$eventBus.$emit('page-data-count', { count: 0 })
        }
        this.requesting = false
      } catch (error) {
        this.$eventBus.$emit('page-data-count', { count: 0 })
        if ([500, 501, 502, 503].includes(error.statusCode)) {
          this.emitSetGlobalNotification(
            'error',
            'Oops - An error occurred on our systems. This was not caused by you. Please retry after sometime.'
          )
        } else {
          this.emitSetGlobalNotification(
            'error',
            `${error.response ? error.response.data.msg : error.message}`
          )
        }
        this.requesting = false
      }
    },
    async refreshData() {
      await this.fetchData()
    },
    async checkSearchQueryExists() {
      if (this.searchQuery.length === 0) {
        this.configs.currentSearchPage = 1
        this.configs.currentPage = 1
        await this.fetchData()
      }
    },
    nextPage() {
      if (!this.configs.meta.nextPage) return
      if (this.searchQuery.length > 0) {
        this.configs.currentSearchPage += 1
      } else {
        this.configs.currentPage += 1
      }
      this.fetchData()
    },
    prevPage() {
      if (!this.configs.meta.prevPage) return
      if (this.searchQuery.length > 0) {
        this.configs.currentSearchPage -= 1
      } else {
        this.configs.currentPage -= 1
      }
      this.fetchData()
    },
    async filterTable() {
      let filterQuery = ''
      for (const key in this.filterShipments) {
        if (this.filterShipments.hasOwnProperty(key) && this.filterShipments[key]) {
          filterQuery += `&${key}=${this.filterShipments[key]}`
        }
      }
      await this.fetchData(filterQuery)
    },
    search() {
      if (this.searchQuery.length >= 3) {
        this.fetchData()
      }
    },
    doAction(action, payload) {
      if (!action) return
      if (!action.length) return
      this.$eventBus.$emit(action, payload)
    },
    clearInputError(inputField) {
      this.inputArea[inputField].hasError = false
      this.inputArea[inputField].errorMsg = null
    },
    handleClickOutside() {
      this.customerListIsOpen = false
      this.arrowCounter = -1
    },
    async updateStatus() {
      const { token } = this.$store.state.auth
      this.requesting = true
      try {
        const queryUrl = '/api/shipments/status/update'
        const { status } = await this.$axios.put(queryUrl, {
          status: this.updateShipmentTo,
          shipment_ids: this.selected
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (status === 200) {
          this.fetchData()
          this.closeUpdateStatusModal(true)
        }
        this.requesting = false
      } catch (error) {
        if ([500, 501, 502, 503].includes(error.statusCode)) {
          this.emitSetGlobalNotification(
            'error',
            'Oops - An error occurred on our systems. This was not caused by you. Please retry after sometime.'
          )
        } else {
          this.emitSetGlobalNotification(
            'error',
            `${error.response ? error.response.data.msg : error.message}`
          )
        }
        this.requesting = false
      }
    },
    async markShipmentAsPaid(shipment) {
      const { token } = this.$store.state.auth
      this.requesting = true
      try {
        const queryUrl = '/api/payments/shipments/mark-paid'
        const { status } = await this.$axios.post(queryUrl, {
          reference: this.newReference(),
          amount: shipment.amount,
          tracking_no: shipment.trackingNo
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (status === 200) {
          this.fetchData()
          this.emitSetGlobalNotification('success', 'Shipment successfully marked as Paid')
        }
        this.requesting = false
      } catch (error) {
        if ([500, 501, 502, 503].includes(error.statusCode)) {
          this.emitSetGlobalNotification(
            'error',
            'Oops - An error occurred on our systems. This was not caused by you. Please retry after sometime.'
          )
        } else {
          this.emitSetGlobalNotification(
            'error',
            `${error.response ? error.response.data.msg : error.message}`
          )
        }
        this.requesting = false
      }
    },
    async createNewShipment() {
      const { token } = this.$store.state.auth
      this.requesting = true
      if (!this.selectedCustomerId) {
        // raise error and set global error
        this.requesting = false
        return
      }
      try {
        const queryUrl = '/api/shipments'
        const { status } = await this.$axios.post(queryUrl, {
          tracking_no: this.inputArea.trackingNo.value,
          weight: this.inputArea.weight.value,
          customer_id: this.selectedCustomerId,
          shipping_group: this.inputArea.shippingGroup.value,
          crating_group: this.inputArea.cratingGroup.value,
          info: this.inputArea.info.value
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (status === 200) {
          this.fetchData()
          this.clearInputFields()
          this.emitSetGlobalNotification('success', 'Shipment Created Successfully')
        }
        this.requesting = false
      } catch (error) {
        if ([500, 501, 502, 503].includes(error.statusCode)) {
          this.emitSetGlobalNotification(
            'error',
            'Oops - An error occurred on our systems. This was not caused by you. Please retry after sometime.'
          )
        } else {
          this.emitSetGlobalNotification(
            'error',
            `${error.response ? error.response.data.msg : error.message}`
          )
        }
        this.requesting = false
      }
    },
    async editShipment() {
      const { token } = this.$store.state.auth
      this.requesting = true
      try {
        const queryUrl = `/api/shipments/${this.activeShipment._id}`
        const { status } = await this.$axios.put(queryUrl, {
          tracking_no: this.inputArea.trackingNo.value,
          weight: this.inputArea.weight.value,
          shipping_group: this.inputArea.shippingGroup.value,
          crating_group: this.inputArea.cratingGroup.value,
          info: this.inputArea.info.value
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (status === 200) {
          this.fetchData()
          this.closeEditShipment()
          this.emitSetGlobalNotification('success', 'Shipment Editted  Successfully')
        }
        this.requesting = false
      } catch (error) {
        if ([500, 501, 502, 503].includes(error.statusCode)) {
          this.emitSetGlobalNotification(
            'error',
            'Oops - An error occurred on our systems. This was not caused by you. Please retry after sometime.'
          )
        } else {
          this.emitSetGlobalNotification(
            'error',
            `${error.response ? error.response.data.msg : error.message}`
          )
        }
        this.requesting = false
      }
    },
    clearInputFields() {
      this.inputArea.trackingNo.value = null
      this.inputArea.customerName.value = null
      this.selectedCustomerId = null
      this.inputArea.weight.value = null
      this.inputArea.shippingGroup.value = null
      this.inputArea.cratingGroup.value = null
      this.inputArea.info.value = null
    },
    closeCreateShipment() {
      this.createShipmentDrawerActive = false
      this.clearInputFields()
    },
    closeEditShipment() {
      this.editShipmentDrawerActive = false
      this.clearInputFields()
    },
    closeUpdateStatusModal(succeeded = false) {
      // this.activeShipment = null
      this.selected = []
      this.updateShipmentTo = null
      this.updateStatusModalActive = false
      this.updateStatusSuccessModal = false

      if (succeeded) {
        this.updateStatusSuccessModal = true
      }
    },
    gotoShipmentDetailPage(trackingNos, toConsolidate = false) {
      if (toConsolidate) {
        if (this.canPaySelected) {
          return this.$eventBus.$emit('set-notification', { type: 'info', msg: 'Select Shipments To Consolidate' })
        }
      }
      if (trackingNos) {
        this.$router.push(`/dashboard/shipments/details?trackingNo=${trackingNos.join(',')}`)
      }
    },
    openShipmentDetailsDrawer(shipment) {
      this.activeShipment = shipment
      this.shipmentDetailsDrawerActive = true
    },
    openEditShipmentDrawer(shipment) {
      this.activeShipment = shipment
      this.inputArea.trackingNo.value = shipment.trackingNo
      this.inputArea.customerName.value = shipment.customerName
      this.selectedCustomerId = shipment.customer
      this.inputArea.weight.value = shipment.weight
      this.inputArea.shippingGroup.value = shipment.shippingGroup
      this.inputArea.cratingGroup.value = shipment.cratingGroup
      this.inputArea.info.value = shipment.info
      this.editShipmentDrawerActive = true
    },
    openUpdateStatusModal(shipment) {
      this.updateShipmentTo = shipment.status
      this.selected = [shipment._id]
      this.updateStatusModalActive = true
      this.updateStatusSuccessModal = false
    },
    selectAddress(address) {
      this.selectedAddress = address
    },
    ...mapActions({
      setManifests: 'print/setManifests',
      setLabels: 'print/setLabels'
    })
  }
}
</script>

<style lang="scss" src="./data-table.scss" scoped />
