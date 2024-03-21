<template>
    <section>
  <div class="container py-5">
    <div class="row">
      <div class="col-md-12 col-lg-3 mb-3 mb-lg-0 my-3" v-for="product in products" :key="product.id">
        <div class="card" >
          <img :src="product.url_image"
            class="card-img-top" alt="Laptop" />
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <p class="small"><a href="#!" class="text-muted">{{ product.category }}</a></p>

            </div>

            <div class="d-flex justify-content-between mb-3">
              
               <router-link :to="'/productinfo/' + product.id" class="no-underline"><p class="mb-0">{{ product.name }}</p></router-link>

              <p class="text-dark mb-0"><small>${{ product.price }}</small></p>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</section>

</template>
<script>
import { ref, onMounted } from "vue";
import { db } from "@/firebase";


import { collection, getDocs} from "firebase/firestore";

export default {
  setup() {
    const products = ref({});
    const productCollection = collection(db, "products");
    const getProductData = async () => {
      const querySnapshot = await getDocs(productCollection);
      let fbProducts = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        const product = {
          id: doc.id,
          name: doc.data().name,
          category: doc.data().category,
          color: doc.data().color,
          price: doc.data().price,
          description: doc.data().description,
          url_image: doc.data().url_image,
          uniqueFileName: doc.data().uniqueFileName,
        };
        fbProducts.push(product);
      });
      products.value = fbProducts;
    };
    onMounted(async () => {
      await getProductData();
    });
    
    return {
      products,
      getProductData,
    };
  },
};
</script>
<style>
  .no-underline {
    text-decoration: none;
    color: inherit; /* Đảm bảo giữ nguyên màu chữ */
  }
</style>