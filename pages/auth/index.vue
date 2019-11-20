<template>
  <div class="page">
    <div class="loading">
      Loading...
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  asyncData({ redirect, store }) {
    return redirect('/auth/login/')
  }
}
</script>
