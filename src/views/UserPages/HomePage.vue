<template>
    <section>
  <div class="container ">
    <div class="row">
      <div class="col-md-12 col-lg-3 mb-3 mb-lg-0 my-4 " v-for="product in products" :key="product.id">
        <div class="card shadow" style="min-height:400px;"  >
           <div class="pt-5">
            <img :src="product.url_image" 
            class="card-img-top" alt="Laptop" />
           </div>
          <div class="card-body">
            <div class="justify-content-between mb-3"> 
             <p class="mb-0">{{ product.name }}</p>
            <p class="text-dark mb-0">Price: ${{ product.price }}</p>
            <p class="small"><a href="#!" class="text-muted">{{ product.category }}</a></p>
            </div>
            <div>
              <router-link :to="'/product/info/'+product.id" class="btn btn-success">More Info</router-link>
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
 .btn.btn-success:hover {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3); /* Thay đổi giá trị shadow tùy theo nhu cầu */
}
</style>