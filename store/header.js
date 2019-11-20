export const state = () => ({
  title: 'Title'
})

export const mutations = {
  setHeaderTitle(state, title) {
    state.title = title
  }
}

export const actions = {
  setHeaderTitleAction({ commit }, title) {
    if (typeof (title) === 'string') {
      commit('setHeaderTitle', title)
    }
  }
}

export const getters = {
  headerTitle: state => {
    return state.title
  }
}
