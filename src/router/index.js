import { createRouter, createWebHistory } from 'vue-router'
import ProductList from '../views/ProductList.vue'
import AddProduct from '../views/AddProduct.vue'
import EditProduct from '../views/EditProduct.vue'
import LogIn from '../views/Auth/LogIn.vue'
import RegisterPage from '../views/Auth/RegisterPage.vue'
import authService from '@/Service/AuthService';
import HomePage from '../views/UserPages/HomePage.vue';


const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/product/list',
    name: 'Product List',
    component: ProductList,
    meta: {
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/product/add',
    name: 'Add Product',
    component: AddProduct,
    meta: {
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/product/edit/:id',
    name: 'Edit Product',
    component: EditProduct,
    meta: {
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/login',
    name: 'Login Page',
    component: LogIn,
  },
  {
    path: '/register',
    name: 'Register Page',
    component: RegisterPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async(to, from, next) => {
  const isLogin = authService.isLogin();
  const isAdmin = authService.isAdmin();
  const requiresAuth = to.meta.requiresAuth;
  const admin = to.meta.admin;


  if (requiresAuth && !isLogin) {
   
    next('/login'); 
  } else if (admin && !isAdmin) {
    alert('You are not authorized to access this page. Admin privileges required.');
   
    next('/');
  } else if(to.path === '/login' && isLogin){
   
    next('/'); 
  }else{
   
    next()
  }
});

export default router;
