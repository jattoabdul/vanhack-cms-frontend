export default function ({ store, redirect }) {
  // If the user is authenticated
  if (store.state.auth.token && store.state.profile.hasOwnProperty('isLecturer')) {
    return redirect('/admin/dashboard/')
  } else if (store.state.auth.token && store.state.profile.hasOwnProperty('isPremium')) {
    return redirect('/dashboard/')
  }
}
