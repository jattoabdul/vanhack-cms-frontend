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
        <!-- <div class="dropdown white-bg sort-dropdown dropdown-primary mr">
          <img class="drop-icon drop-icon-left" src="/svg/ic-filter-list.svg" alt="drop">
          <span class="drop-text inverse">Filters</span>
          <div class="dropdown-wrapper dropdown-wrapper-card">
            <div class="dropdown-options">
              <div>
                <label>Customer Type</label>
                <select class="form-input-select">
                  <option>All</option>
                  <option>Nigerian</option>
                  <option>Non Nigerian</option>
                </select>
              </div>
            </div>
          </div>
        </div> -->
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
        <div class="search">
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
      </div>
    </div>
    <!-- TOP UP FORM Drawer -->
    <drawer v-if="walletTopUpDrawerActive" id="top-up" class="as-modal">
      <div class="drawer-heading">
        <h4 class="title">
          Top up
        </h4>
        <a class="close" href="javascript:;" role="button" @click="closeTopUpModal">&times;</a>
      </div>
      <div class="drawer-content">
        <form @submit.prevent="completePaymentAction">
          <div class="form-field prefixed" :class="{ error: topUpInput.hasError }">
            <div class="input-withPrefix">
              <div class="dropdown-formOption">
                <span class="current-value">
                  ₦
                </span>
              </div>
              <label for="topup_nav">
                I want to fund my wallet with
              </label>
              <input
                id="topup_nav"
                v-model="topUpInput.value"
                name="topup_nav"
                type="text"
                required
                @focus="topUpInput.label = true"
                @blur="topUpInput.label = false"
              >
            </div>
            <span class="error-text">
              <span>{{ topUpInput.errorMsg }}</span>
            </span>
          </div>
          <p>
            <span>{{ topUpInput.value || '0' }} NGN</span> → <span>{{ computedTopUpInput }} USD</span>
          </p>
          <br>
          <div class="flex-space-between">
            <button type="button" class="inverse" @click="closeTopUpModal">
              Cancel
            </button>
            <button type="submit" class="longer">
              Submit
            </button>
          </div>
        </form>
      </div>
    </drawer>
    <div class="table" :class="{ loading: requesting }">
      <!-- tables heading shimmer -->
      <div v-if="requesting" class="no-content-head">
        <content-placeholders>
          <content-placeholders-heading />
        </content-placeholders>
      </div>

      <!-- tables heading -->
      <div v-else class="th small-gap" :style="{ gridTemplateColumns: `3rem 2fr repeat(3, 1fr) 2fr 0.5fr 4rem` }">
        <span class="cell check-cell">
          <input v-model="selectAll" type="checkbox">
        </span>
        <span v-for="(heading, headingIndex) in headings" :key="headingIndex" class="cell" :class="{ 'center-align': heading.name === 'Wallet balance' }" v-text="heading.name" />
      </div>

      <!-- tables body loading shimmer -->
      <div v-if="requesting" class="no-content-body">
        <content-placeholders>
          <content-placeholders-text :lines="12" />
        </content-placeholders>
      </div>

      <!-- tables body no content display -->
      <div v-else-if="!tableData.length" class="no-content">
        <p>No Data To Be Displayed</p>
      </div>

      <!-- tables body content -->
      <div
        v-for="(row, rowIndex) in tableData"
        v-else
        :key="rowIndex"
        class="tr small-gap"
        :style="{ gridTemplateColumns: `3rem 2fr repeat(3, 1fr) 2fr 0.5fr 4rem` }"
        @click.stop="gotoCustomerDetailPage(row._id)"
      >
        <span class="cell check-cell" @click.stop>
          <input
            v-if="row._id"
            :id="row._id"
            v-model="selected"
            :value="row._id"
            :sector="row._id"
            type="checkbox"
          >
        </span>
        <span class="cell" v-text="row._id ? row._id : '--'" />
        <span class="cell" v-text="row.firstName ? `${row.firstName}` : '--'" />
        <span class="cell" v-text="row.lastName ? `${row.lastName}` : '--'" />
        <span class="cell" v-text="row.phone ? row.phone : '--'" />
        <span class="cell overflow ellipsis" v-text="row.email ? row.email : '--'" />
        <span class="cell" v-text="row.walletBalance ? `${row.walletBalance.usd} (${row.walletBalance.ngn})` : '--'" />
        <span class="cell actions" @click.stop="">
          <div class="dropdown white-bg sort-dropdown more-actions">
            <img src="/svg/ic-more-vert.svg" alt="more">
            <div class="dropdown-wrapper">
              <div class="dropdown-options">
                <span v-ripple="configs.actionRipple" @click="openTopUpModal(row)" v-text="'Top up wallet'" />
              </div>
            </div>
          </div>
        </span>
      </div>
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
      searchQuery: '',
      bulkCheck: false,
      selected: [],
      configs: {
        actionRipple: 'rgba(177, 50, 49, 0.3)',
        meta: {},
        currentPage: 1,
        currentSearchPage: 1
      },
      walletTopUpDrawerActive: false,
      customerToTopUp: null,
      topUpInput: {
        value: null,
        label: false,
        hasError: false,
        errorMsg: null
      },
      tableRawData: [],
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
    computedTopUpInput() {
      const nairaAmount = this.topUpInput.value
      if (nairaAmount) {
        // calculate dollar value for nairaAmount
        return (Number(nairaAmount) / 360).toFixed(2)
      }
      return 0
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
            if (select.customerId) {
              this.selected.push(select.customerId)
            }
          })
        }
      }
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
    this.$eventBus.$on('close-top-up-drawer', payload => {
      this.walletTopUpDrawerActive = false
    })
  },
  beforeDestroy() {
    this.$eventBus.$off('refresh-table')
    this.$eventBus.$off('close-top-up-drawer')
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
        let queryUrl = `/api${dataUrl}?per_page=${perPage}&page=${this.configs.currentPage}`

        if (this.searchQuery.length > 0) {
          queryUrl = `/api/accounts/search/customer?query=${this.searchQuery}&per_page=${perPage}&page=${this.configs.currentSearchPage}`
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
      this.configs.currentPage += 1
      this.fetchData()
    },
    prevPage() {
      if (!this.configs.meta.prevPage) return
      this.configs.currentPage -= 1
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
    openTopUpModal(row) {
      this.customerToTopUp = row._id
      this.topUpInput.value = null
      this.walletTopUpDrawerActive = true
    },
    closeTopUpModal() {
      this.customerToTopUp = null
      this.topUpInput.value = null
      this.walletTopUpDrawerActive = false
    },
    completePaymentAction: async function (response) {
      const { token } = this.$store.state.auth
      const dataUrl = '/customers/wallet/credit'
      this.requesting = true
      try {
        const queryUrl = `/api${dataUrl}`
        const { data, status } = await this.$axios.post(
          queryUrl,
          {
            customer: this.customerToTopUp,
            amount: this.topUpInput.value
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (status === 200 && data) {
          this.fetchData()
          // display success Notification
          this.emitSetGlobalNotification('success', 'topup successful')
          this.closeTopUpModal()
          this.requesting = false
        }
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
    onPaymentError: function () {
      this.emitSetGlobalNotification(
        'error',
        'Payment Error Occured'
      )
    },
    doAction(action, payload) {
      if (!action) return
      if (!action.length) return
      this.$eventBus.$emit(action, payload)
    },
    gotoCustomerDetailPage(customerId) {
      if (customerId) {
        this.$router.push(`/dashboard/customers/${customerId}`)
      }
    }
  }
}
</script>

<style lang="scss" src="./data-table.scss" scoped />
