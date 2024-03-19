import { createStore } from "vuex"

export default createStore({
  state: {
    isLogin: false,
    isAdmin: false,
  },
  getters: {
  },
  mutations: {
    setIsLogin(state, isLoggedIn) {
      state.isLogin = isLoggedIn;
    },
    setIsAdmin(state, isAdmin) {
      state.isAdmin = isAdmin;
    },
  },
  actions: {
    setIsLogin({ commit }, isLogin) {
      commit('setIsLogin', isLogin);
    },
    setIsAdmin({ commit }, isAdmin) {
      commit('setIsAdmin', isAdmin);
    },
  },
  modules: {
  }
})
