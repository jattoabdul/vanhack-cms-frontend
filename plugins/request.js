// import { swal } from 'vue-swal'
// import dotenv from 'dotenv'

// dotenv.config()

export default function ({ $axios, store }) {
  const token = store.state.token
  // const $swal = swal
  $axios.onRequest((config) => {
    // ...
    // Refresh JWT token if needed
    // ...
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })
  // $axios.onResponse((response) => {
  //   // const { msg, payload } = response.data
  //   const { msg } = response.data
  //   if (msg && msg.toLowerCase() !== 'ok') {
  //     // console.log({ msg }, 'On Response::Success')
  //   }
  // })
  // $axios.onError((err) => {
  //   if (err.request) {
  //     // console.log('Attempt failed. Please check your internet', 'On Response::Error')
  //   }
  //   if (err.response) {
  //     const { msg } = err.response.data
  //     if (msg) {
  //       // console.log({ msg }, 'On Response::Error')
  //     }
  //   }
  // })
}
