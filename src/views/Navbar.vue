<template>
  <nav
    class="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow-sm p-3 mb-5 bg-body rounded m-3 border border-1"
  >
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img
          src="../assets/logo.png"
          alt=""
          width="30"
          height="24"
          class="d-inline-block align-text-top"
        />
        E-commerce
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="/">Home</a>
          </li>
          <li class="nav-item">
            <button class="btn nav-link" aria-current="page" @click="abcd">
              Home
            </button>
          </li>
          <li
            class="nav-item"
            v-if="$store.state.isAdmin && $store.state.isLogin"
          >
            <a class="nav-link" aria-current="page" href="/product/list">
              Product List
            </a>
          </li>
          <li
            class="nav-item"
            v-if="$store.state.isAdmin && $store.state.isLogin"
          >
            <a class="nav-link" href="/product/add">Add Product</a>
          </li>
        </ul>
        <template v-if="$store.state.isLogin">
          <div class="me-2" v-if="!isCurrentLoginOrRegister">
            <button class="btn btn-danger" @click="handleLogout">Logout</button>
          </div>
        </template>
        <template v-else>
          <div class="me-2" v-if="!isCurrentLoginOrRegister">
            <router-link to="/login" class="btn btn-success">Login</router-link>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import  AuthService  from "../Service/AuthService";
import { onMounted } from "vue";
export default {
  name: "HomeView",
  components: {},
  
  computed: {
    isCurrentLoginOrRegister() {
      return (
        this.$router.currentRoute.value.path === "/login" ||
        this.$router.currentRoute.value.path === "/register"
      );
    },
  },

  setup() {
     const router = useRouter();
    const store = useStore();
    const abcd = () => {
      console.log(1234);
      console.log(store.state.isLogin);
      console.log(store.state.isAdmin);
    };
    const handleLogout = () => {
      localStorage.removeItem("userLogin");
      router.push("/login");
      store.commit("setIsLogin", false);
      store.commit("setIsAdmin", false);
    };
    onMounted(async () => {
      await AuthService.checkLogin()
    });
    return {
      store,
      abcd,
      handleLogout
    };
  },
};
</script>
