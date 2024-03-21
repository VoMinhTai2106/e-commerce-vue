<template>     
<div class="container">
    <div class="col-lg-11 border p-3 main-section bg-white mx-3 my-3  rounded">
        <div class="row m-0">
            <div class="col-lg-4 left-side-product-box pb-3">
                <img :src="selectedImageURL" class="border p-3">
            </div>
            <div class="col-lg-8">
                <div class="right-side-pro-detail border p-3 m-0">
                    <div class="row">
                        <div class="col-lg-12 pt-2">
                            <h5 class=""><b>Product Detail</b></h5>
                            <h5 >{{product.name}}</h5>
                            <span >{{product.description}}</span>
                        </div>
                        <div class="col-lg-12 d-flex" >
                            <p class="tag-section m-auto"><strong>Tag : {{ product.category }} </strong></p>
                            <p class="m-0 p-0 price-pro m-auto">{{product.price}} VND</p>
                        </div>
                        <div class="col-lg-12 d-flex">
                            <label class="m-auto">Quantity :</label>
                            <input type="number" class="form-control text-center w-25 m-auto" value="1">
                        </div>
                        <div class="col-lg-12 mt-3">
                            <div class="row">
                                <div class="col-lg-6 pb-2 m-auto">
                                    <a href="#" class="btn btn-danger w-100">Add To Cart</a>
                                </div>
                                <div class="col-lg-6">
                                    <a href="#" class="btn btn-success w-100">Buy Now</a>
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
    const handleImageChange = (event) => {
      const file = event.target.files[0];
      selectedImage.value = file;
      selectedImageURL.value = URL.createObjectURL(file);
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
      handleImageChange,

    };
  },
};
</script>
<style>
body {
    font-family: 'Roboto Condensed', sans-serif;
    background-color: #f5f5f5
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

.right-side-pro-detail span {
    font-size: 15px;
}

.right-side-pro-detail p {
    font-size: 25px;
    color: #a1a1a1;
}

.right-side-pro-detail .price-pro {
    color: #E45641;
}

.right-side-pro-detail .tag-section {
    font-size: 18px;
    color: #5D4C46;
}

.pro-box-section .pro-box img {
    width: 100%;
    height: 200px;
}

@media (min-width:360px) and (max-width:640px) {
    .pro-box-section .pro-box img {
        height: auto;
    }
}
</style>