import cookieparser from 'cookieparser'
// import { persist, desist } from './utils'

export const state = () => ({})

export const mutations = {}

export const getters = {}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)

      const { token, profile } = parsed

      if (token) {
        commit('auth/setToken', token)
      }

      if (profile) {
        commit('profile/setProfile', JSON.parse(profile))
      }
    }
  }
}
