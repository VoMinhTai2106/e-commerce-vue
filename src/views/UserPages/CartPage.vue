<template>
  <section
    class="py-2 shadow rounded border border-2"
    style="background-color: #fdccbc"
  >
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col">
          <p>
            <span class="h2">Shopping Cart </span
            ><span class="h4">( {{ carts.length }} items in your cart)</span>
          </p>

          <div
            class="card mb-4 shadow"
            v-for="(item, index) in carts"
            :key="index"
          >
            <div class="card-body p-4">
              <div class="row align-items-center">
                <div class="col-md-2">
                  <img
                    :src="item.img_url"
                    class="img-fluid"
                    alt="Product image"
                  />
                </div>
                <div class="col-md-2 d-flex justify-content-center">
                  <div>
                    <p class="small text-muted mb-4 pb-2">Name</p>
                    <p class="lead fw-normal mb-0">{{ item.name }}</p>
                  </div>
                </div>
                <div class="col-md-1 d-flex justify-content-center">
                  <div>
                    <p class="small text-muted mb-4 pb-2">Color</p>
                    <p class="lead fw-normal mb-0">
                      <button
                        class="btn"
                        style="border-radius: 50%; width: 25px; height: 25px"
                        :style="{ backgroundColor: item.color }"
                      ></button>
                    </p>
                  </div>
                </div>
                <div class="col-md-2 d-flex justify-content-center">
                  <div>
                    <p class="small text-muted mb-4 pb-2">Quantity</p>
                    <div class="def-number-input number-input safari_only">
                      <button
                        @click="decrementQuantity(item)"
                        class="minus"
                      ></button>
                      <input
                        class="quantity fw-bold text-black"
                        min="1"
                        name="quantity"
                        v-model="item.quantity"
                        type="number"
                      />
                      <button
                        @click="incrementQuantity(item)"
                        class="plus"
                      ></button>
                    </div>
                  </div>
                </div>
                <div class="col-md-2 d-flex justify-content-center">
                  <div>
                    <p class="small text-muted mb-4 pb-2">Price</p>
                    <p class="lead fw-normal mb-0">{{ item.price }}</p>
                  </div>
                </div>
                <div class="col-md-2 d-flex justify-content-center">
                  <div>
                    <p class="small text-muted mb-4 pb-2">Total</p>
                    <p class="lead fw-normal mb-0">{{ getTotalPrice(item) }}</p>
                  </div>
                </div>
                <div class="col-md-1 d-flex justify-content-center">
                  <div>
                    <button
                      @click="removeFromCart(index)"
                      class="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-5" v-if="carts.length > 0">
            <div class="card-body p-4">
              <div class="float-end">
                <p class="mb-0 me-5 d-flex align-items-center">
                  <span class="small text-muted me-2">Order total:</span>
                  <span class="lead fw-normal">{{ getTotalCartPrice() }}</span>
                </p>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end">
            <a href="/" class="btn btn-light btn-lg me-2">
              Continue Shopping
            </a>
            <a href="/product/checkout" class="btn btn-primary btn-lg">
              Proceed to checkout
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const carts = ref([]);
    const router = useRouter();
    const userLogin = JSON.parse(localStorage.getItem("userLogin"));
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

    function getTotalPrice(item) {
      return (item.quantity * item.price).toLocaleString("en-US") + " VND";
    }

    function getTotalCartPrice() {
      return carts.value.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      ).toLocaleString("en-US") + " VND";
    }

    function decrementQuantity(item) {
      if (item.quantity > 0) {
        item.quantity--;
        updateLocalStorage();
      }
    }

    function incrementQuantity(item) {
      item.quantity++;
      updateLocalStorage();
    }

    function updateLocalStorage() {
      localStorage.setItem("carts", JSON.stringify(carts.value));
    }
    function removeFromCart(index) {
      carts.value.splice(index, 1);
      updateLocalStorage();
    }

    return {
      carts,
      getTotalPrice,
      getTotalCartPrice,
      decrementQuantity,
      incrementQuantity,
      removeFromCart,
    };
  },
};
</script>



<style scoped>
/* Your styles here */
</style>

<style scoped>
.number-input input[type="number"] {
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  appearance: textfield;
}

.number-input input[type="number"]::-webkit-inner-spin-button,
.number-input input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

.number-input button {
  -webkit-appearance: none;
  background-color: transparent;
  border: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0;
  position: relative;
}

.number-input button:before,
.number-input button:after {
  display: inline-block;
  position: absolute;
  content: "";
  height: 2px;
  transform: translate(-50%, -50%);
}

.number-input button.plus:after {
  transform: translate(-50%, -50%) rotate(90deg);
}

.number-input input[type="number"] {
  text-align: center;
}

.number-input.number-input {
  border: 1px solid #ced4da;
  width: 10rem;
  border-radius: 0.25rem;
}

.number-input.number-input button {
  width: 2.6rem;
  height: 0.7rem;
}

.number-input.number-input button.minus {
  padding-left: 10px;
}

.number-input.number-input button:before,
.number-input.number-input button:after {
  width: 0.7rem;
  background-color: #495057;
}

.number-input.number-input input[type="number"] {
  max-width: 4rem;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-width: 0 1px;
  font-size: 1rem;
  height: 2rem;
  color: #495057;
}

@media not all and (min-resolution: 0.001dpcm) {
  @supports (-webkit-appearance: none) and (stroke-color: transparent) {
    .number-input.def-number-input.safari_only button:before,
    .number-input.def-number-input.safari_only button:after {
      margin-top: -0.3rem;
    }
  }
}

.shopping-cart .def-number-input.number-input {
  border: none;
}

.shopping-cart .def-number-input.number-input input[type="number"] {
  max-width: 2rem;
  border: none;
}

.shopping-cart .def-number-input.number-input input[type="number"].black-text,
.shopping-cart .def-number-input.number-input input.btn.btn-link[type="number"],
.shopping-cart
  .def-number-input.number-input
  input.md-toast-close-button[type="number"]:hover,
.shopping-cart
  .def-number-input.number-input
  input.md-toast-close-button[type="number"]:focus {
  color: #212529 !important;
}

.shopping-cart .def-number-input.number-input button {
  width: 1rem;
}

.shopping-cart .def-number-input.number-input button:before,
.shopping-cart .def-number-input.number-input button:after {
  width: 0.5rem;
}

.shopping-cart .def-number-input.number-input button.minus:before,
.shopping-cart .def-number-input.number-input button.minus:after {
  background-color: #9e9e9e;
}

.shopping-cart .def-number-input.number-input button.plus:before,
.shopping-cart .def-number-input.number-input button.plus:after {
  background-color: #4285f4;
}
</style>