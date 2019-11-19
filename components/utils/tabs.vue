<template>
  <div class="tabs">
    <div class="tabs-menu">
      <ul>
        <li v-for="(tab, index) in tabs" :key="index" :class="{ 'is-active': tab.isActive }">
          <a :href="tab.href" @click.prevent="selectTab(tab)">
            {{ tab.name }}
          </a>
          <div />
        </li>
      </ul>
    </div>
    <div class="tabs-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: []
    }
  },
  created() {
    this.tabs = this.$children
  },
  methods: {
    selectTab(selectedTab) {
      this.tabs.forEach(tab => {
        tab.isActive = (tab.name === selectedTab.name)
      })
      const activeTab = this.tabs.filter(tab => tab.isActive)[0]
      this.$router.replace(activeTab.href || '')
    }
  }
}
</script>

<style lang="scss" src="./tabs.scss" scoped />
