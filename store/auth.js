import { persist, desist } from './utils'

export const state = () => ({
  token: null,
  reauth: false
})

export const mutations = {
  setToken(state, token) {
    state.token = token
    persist('token', state.token)
  },
  unSetToken(state) {
    state.token = null
    desist('token')
  }
}

export const actions = {
  setTokenAction({ commit }, token) {
    commit('unSetToken')
    if (typeof (token) === 'string') {
      commit('setToken', token)
    } else {
      commit('setToken', null)
    }
  },
  unSetTokenAction({ commit }) {
    commit('unSetToken')
  }
}

export const getters = {
  authToken: state => {
    return state.token
  }
}
