<template>
  <div class="page">
    <div class="loading">
      Loading...
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Vanhack - Class Management - Page Loading...'
  },
  components: {},
  asyncData({ redirect, store }) {
    return redirect('/auth/login/')
  }
}
</script>
