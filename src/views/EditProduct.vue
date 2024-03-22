<template>
  <div class="row border rounded-2 border-2 bg-light m-1 ">
    <div class="bg-primary mb-3">
      <h1 class="text-white text-center">Edit Product</h1>
    </div>
    <form @submit.prevent="updateProduct">
      <div class="row g-2">
        <div class="col-sm-6">
          <div class="mb-3 d-flex align-items-center">
            <label for="productname" class="col-form-label col-sm-2"
              >Name:</label
            >
            <input
              type="text"
              class="form-control"
              id="productname"
              v-model="product.name"
              required
            />
          </div>
          <div class="mb-3 d-flex align-items-center">
            <label for="category" class="col-form-label col-sm-2"
              >Category:</label
            >
            <select class="form-select" v-model="product.category" required>
              <option
                v-for="(value, key) in categories"
                :key="key"
                :value="key"
              >
                {{ value }}
              </option>
            </select>
          </div>
          <div class="mb-3 d-flex align-items-center">
            <label for="price" class="col-form-label col-sm-2">Price:</label>
            <input
              type="number"
              class="form-control"
              id="price"
              v-model="product.price"
              required
            />
          </div>
          <div class="mb-3 d-flex align-items-center">
            <label for="colorPicker" class="col-form-label col-sm-2"
              >Color:</label
            >
            <input
              type="color"
              class="form-control form-control-color"
              id="colorPicker"
              v-model="product.color"
            />
          </div>
          <div class="mb-3 d-flex align-items-center">
            <label for="description" class="col-form-label col-sm-2"
              >Description:</label
            >
            <textarea
              class="form-control"
              id="description"
              rows="3"
              v-model="product.description"
              required
            ></textarea>
          </div>
        </div>
                <div class="col-sm-6">
          <div class="mb-3">
            <label for="formFile" class="col-form-label col-sm-2 text-white border boder-2 bg-primary">Add Image</label>
            <input
              class="form-control d-none"
              type="file"
              id="formFile"
              @change="handleImageChange"
              required
            />
          </div>
           <div v-if="selectedImageURL" class="d-flex justify-content-center">
            <img
              :src="selectedImageURL"
              alt="Selected Image"
              class="img-thumbnail img-fluid product-image"
              style="max-width: 100%; max-height: 250px; object-fit: cover;"
            />
          </div>
        </div>
      </div>
      <div>
        <button class="btn btn-primary" type="submit">Edit</button>
      </div>
    </form>
  </div>
</template>


<script>
import { ref, onMounted } from "vue";
import { db,storage } from "../firebase";
import { useRouter } from "vue-router";
import { doc, getDoc, updateDoc, } from "firebase/firestore";
import {
  ref as firebaseRef,
  getDownloadURL,
  uploadBytes,
  deleteObject
} from "firebase/storage";

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
    const deleteImage = async (uniqueFileName) => {
        const desertRef = firebaseRef(storage, "images/" + uniqueFileName);
        deleteObject(desertRef)
          .then(() => {
            console.log(" File deleted successfully");
          })
          .catch((error) => {
            console.log(" Uh-oh, an error occurred!: " + error);
          });

      
    };
    const updateProduct = async () => {
        if (!product.value.color) {
        alert("Vui lòng chọn màu");
        return;
      }
      try {
        if (selectedImage.value) {
           await deleteImage(product.value.uniqueFileName);
          const timestamp = Date.now();
          const uniqueFileName = `${timestamp}_${selectedImage.value.name}`;
          const storageRef = firebaseRef(storage, "images/" + uniqueFileName);
          await uploadBytes(storageRef, selectedImage.value);
          console.log("Upload file successfully");
          const imageUrl = await getDownloadURL(storageRef);
          product.value.url_image = imageUrl;
          product.value.uniqueFileName = uniqueFileName;

        }
      await updateDoc(docRef, {
        name: product.value.name,
        category: product.value.category,
        color: product.value.color,
        price: product.value.price,
        description: product.value.description,
        url_image: product.value.url_image,
        uniqueFileName: product.value.uniqueFileName, 
      });
    product.value = {};
        alert("Edit Product successfully");
        router.push("/product/list")
      }catch (error) {
        console.error(error);
      }
    };
    return {
      categories,
      product,
      selectedImage,
      selectedImageURL,
      handleImageChange,
      updateProduct
    };
  },
};
</script>
<style>
</style>