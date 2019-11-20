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
    return redirect('/admin/dashboard/courses/')
  }
}
</script>
