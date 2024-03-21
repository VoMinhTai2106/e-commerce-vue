<template>
  <div class="container-fluid">
    <div class="col-md-11 border p-3 main-section bg-white my-3 rounded shadow">
      <div class="row m-0">
        <div class="col-lg-5 left-side-product-box pb-3">
          <img :src="selectedImageURL" class="border-end border-2 p-3" />
        </div>
        <div class="col-lg-7">
          <div class="right-side-pro-detail p-3 m-0" style="min-height: 390px">
            <div class="row">
              <div class="col-lg-12 py-2">
                <h5 style="font-size: 40px">
                  <b>{{ product.name }}</b>
                </h5>
              </div>
              <div class="col-lg-12 pb-2">
                <p class="tag-section m-auto">
                  <strong>Category : {{ product.category }} </strong>
                </p>
                <div class="ms-2">
                  <b>Product Color: </b>
                  <button
                    class="btn"
                    style="border-radius: 50%; width: 25px; height: 25px"
                    :style="{ backgroundColor: product.color }"
                  ></button>
                </div>
                <p class="m-0 p-0 price-pro m-auto">
                  <b>Price:</b>
                  {{
                    product && product.price
                      ? product.price.toLocaleString("en-US") + " VND"
                      : ""
                  }}
                </p>
              </div>
              <div class="col-lg-12 d-flex">
                <label class="m-auto"><b>Quantity :</b></label>
                <input
                  type="number"
                  class="form-control text-center w-25 m-auto"
                  value="1"
                  min="1"
                  v-model="quantity"
                />
              </div>
              <div>
                <span style="font-size: 20px"
                  ><b>Description</b>: {{ product.description }}</span
                >
              </div>
              <div class="col-lg-12 mt-3">
                <div class="row">
                  <div class="col-lg-6 pb-2 m-auto">
                    <a
                      href="#"
                      @click="addCart()"
                      class="btn btn-danger w-100"
                      >Add To Cart</a
                    >
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import { db } from "@/firebase";
import { useRouter } from "vue-router";
import { doc, getDoc } from "firebase/firestore";

export default {
  setup() {
    const quantity = ref(1);
    const categories = ref({
      mobile: "Mobile",
      laptop: "Laptop",
      watch: "Watch",
      camera: "Camera",
    });
    const product = ref({});
    const selectedImage = ref(null);
    const selectedImageURL = ref("");
    const router = useRouter();
    const productId = router.currentRoute.value.params.id;
    const docRef = doc(db, "products", productId);

    const addCart = () => {
      const userLogin = JSON.parse(localStorage.getItem("userLogin"));
      if (!userLogin) {
        alert("Please login first!");
        router.push("/login");
        return;
      }

      let carts = JSON.parse(localStorage.getItem("carts")) || [];
      let cartIndex = -1; // Biến này sẽ lưu vị trí của sản phẩm trong giỏ hàng nếu đã tồn tại

      // Tìm kiếm sản phẩm trong giỏ hàng có userId và productId tương tự
      for (let i = 0; i < carts.length; i++) {
        if (
          carts[i].userid === userLogin.id &&
          carts[i].productId === productId
        ) {
          cartIndex = i; // Lưu lại vị trí của sản phẩm trong giỏ hàng
          break; // Thoát khỏi vòng lặp khi tìm thấy sản phẩm
        }
      }

      if (cartIndex !== -1) {
        carts[cartIndex].quantity += quantity.value;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm vào giỏ hàng
        let cart = {
          userid: userLogin.id,
          productId: productId,
          name: product.value.name,
          category: product.value.category,
          price: product.value.price,
          quantity: quantity.value,
          color: product.value.color,
          img_url: product.value.url_image

        };
        carts.push(cart);
      }

      // Lưu giỏ hàng vào localStorage
      localStorage.setItem("carts", JSON.stringify(carts));
      alert("Add Successfully")
      router.push("/")
    };

    onMounted(async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        product.value = docSnap.data();
        console.log("product:" + product.value);
        selectedImageURL.value = docSnap.data().url_image;
      } else {
        console.log("No such document!");
      }
    });
    return {
      categories,
      product,
      selectedImage,
      selectedImageURL,
      addCart,
      quantity,
    };
  },
};
</script>
<style>
body {
  font-family: "Roboto Condensed", sans-serif;
  background-color: #f5f5f5;
}

.hedding {
  font-size: 20px;
  color: #ab8181;
}

.main-section {
  position: absolute;
  left: 50%;
  right: 50%;
  transform: translate(-50%, 5%);
}

.left-side-product-box img {
  width: 100%;
}

.left-side-product-box .sub-img img {
  margin-top: 5px;
  width: 83px;
  height: 100px;
}

.pro-box-section .pro-box img {
  width: 100%;
  height: 200px;
}

@media (min-width: 360px) and (max-width: 640px) {
  .pro-box-section .pro-box img {
    height: auto;
  }
}
</style>