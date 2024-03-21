<template>
  <div
    class="py-4 row shadow rounded border border-2"
    style="background-color: #fdccbc"
  >
    <div class="col-md-4 order-md-2 mb-4">
      <h4 class="d-flex justify-content-between align-items-center mb-3">
        <span class="text-muted">Your cart</span>
        <span class="badge badge-secondary badge-pill">{{ carts.length }}</span>
      </h4>
      <hr class="mb-3" />
      <ul class="list-group mb-3" v-for="(item, index) in carts" :key="index">
        <li class="list-group-item d-flex justify-content-between lh-condensed">
          <div>
            <h6 class="my-0">{{ item.name }} x {{ item.quantity }}</h6>
          </div>
          <span class="text-muted">{{ getTotalPrice(item) }}</span>
        </li>
      </ul>
      <li class="list-group-item d-flex justify-content-between">
        <span>Total</span>
        <strong>{{ getTotalCartPrice() }}</strong>
      </li>
    </div>
    <div class="col-md-8 order-md-1">
      <h4 class="mb-3">Billing address</h4>
      <form class="needs-validation" @submit.prevent="checkout">
        <div class="d-flex">
          <div class="mb-3 col-6 me-1">
            <label for="name">Full Name </label>
            <input
              type="text"
              class="form-control"
              id="name"
              placeholder="John Doe"
              v-model="userdetail.fullname"
              required
            />
          </div>

          <div class="mb-3 col-6">
            <label for="phone">Phone Number</label>
            <input
              type="number"
              class="form-control"
              id="phone"
              placeholder="0123456789"
              minlength="10"
              maxlength="11"
              v-model="userdetail.phone"
              required
            />
          </div>
        </div>

        <div class="mb-3">
          <label for="address">Address</label>
          <input
            type="text"
            class="form-control"
            id="address"
            placeholder="1234 Main St"
            v-model="userdetail.address"
            required
          />
        </div>

        <hr class="mb-4" />

        <h4 class="mb-3">Payment</h4>

        <div class="d-block my-3">
          <div class="custom-control custom-radio">
            <input
              id="bank"
              name="paymentMethod"
              type="radio"
              class="custom-control-input"
              value="Bank"
              required
            />
            <label class="custom-control-label" for="bank">Bank</label>
          </div>
          <div class="custom-control custom-radio">
            <input
              id="aftership"
              name="paymentMethod"
              type="radio"
              class="custom-control-input"
              value="After Ship"
              required
            />
            <label class="custom-control-label" for="aftership"
              >After Shipped</label
            >
          </div>
        </div>

        <hr class="mb-4" />
        <button class="btn btn-primary btn-lg btn-block me-2" type="submit">
          Checkout
        </button>
        <a class="btn btn-primary btn-lg btn-block" href="/product/cart">
          Return to cart
        </a>
      </form>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  setup() {
    const carts = ref([]);
    const router = useRouter();
    const userLogin = JSON.parse(localStorage.getItem("userLogin"));
    const userdetail = ref({});

    const getCarts = () => {
      if (!userLogin) {
        alert("Please login first!");
        router.push("/login");
        return;
      }

      const storedCarts = JSON.parse(localStorage.getItem("carts"));
      if (storedCarts && storedCarts.length > 0) {
        carts.value = storedCarts.filter(
          (cart) => cart.userid === userLogin.id
        );
      }else{
         alert("Please add something to cart");
        router.push("/");   
      }
    };

    onMounted(() => {
      getCarts();
    });

    const saveOrder = async () => {
      const products = carts.value
        .map((item) => `${item.name} x ${item.quantity}`)
        .join(", ");

      try {
        await addDoc(collection(db, "orders"), {
          userId: userLogin.id,
          products: products,
          total: getTotalCartPrice(),
          full_name: userdetail.value.fullname,
          phone: userdetail.value.phone,
          address: userdetail.value.address,
        });

        // Xóa giỏ hàng sau khi lưu đơn hàng thành công
        localStorage.removeItem("carts");

        // Điều hướng về trang chủ
        router.push("/");
      } catch (error) {
        console.error("Error saving order:", error);
      }
    };

    function getTotalPrice(item) {
      return (item.quantity * item.price).toLocaleString("en-US") + " VND";
    }

    function getTotalCartPrice() {
      return (
        carts.value
          .reduce((total, item) => total + item.quantity * item.price, 0)
          .toLocaleString("en-US") + " VND"
      );
    }

    const checkout = () => {
      let storedCarts = JSON.parse(localStorage.getItem("carts"));
      try {
        storedCarts = storedCarts.filter(
          (item) => item.userid !== userLogin.id
        );
        localStorage.setItem("carts", JSON.stringify(storedCarts));
      } catch (error) {
        console.log(error);
      }

      saveOrder();
    };

    return {
      carts,
      getTotalPrice,
      getTotalCartPrice,
      checkout,
      userdetail,
    };
  },
};
</script>

<style scoped>
/* Your styles here */
</style>
