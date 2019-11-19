import { persist, desist } from './utils'

export const state = () => ({
  me: {}
})

export const mutations = {
  setProfile(state, profile) {
    state.me = profile
    persist('profile', state.me)
  },
  updateProfile(state, profile) {
    Object.keys(profile).forEach((val) => {
      state.me[val] = profile[val]
    })
    persist('profile', state.me)
  },
  resetProfile(state) {
    state.me = {}
    desist('profile')
  }
}

export const actions = {
  setProfileAction({ commit }, profile) {
    commit('resetProfile')
    commit('setProfile', profile)
  },
  updateProfileAction({ commit }, profile) {
    if (profile && (profile instanceof Object)) {
      commit('updateProfile', profile)
    }
  },
  resetProfileAction({ commit }) {
    commit('resetProfile')
  }
}

export const getters = {
  profile: state => {
    return state
  }
}
