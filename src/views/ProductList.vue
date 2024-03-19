<template>
  <table class="table table-bordered table-striped rounded">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Image</th>
        <th scope="col">Name</th>
        <th scope="col">Category</th>
        <th scope="col">Color</th>
        <th scope="col">Price</th>
        <th scope="col">Description</th>
        <th scope="col">Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="product in products" :key="product.id">
        <td scope="row">
          <input type="checkbox" />
        </td>
        <td>
          <img
            width="100px"
            class="border rounded ms-2"
            :src="product.url_image"
          />
        </td>
        <td>{{ product.name }}</td>
        <td>{{ product.category }}</td>
        <td>
          <button
            class="btn"
            style="border-radius: 50%; width: 25px; height: 25px"
            :style="{ backgroundColor: product.color }"
          ></button>
        </td>
        <td>{{ product.price }}</td>
        <td>{{ product.description }}</td>
        <td>
          <div>
            <router-link :to="'/product/edit/' + product.id" class="btn btn-success">Edit</router-link>
            <button
              class="btn btn-danger"
              @click="deleteProduct(product.id, product.uniqueFileName)"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { ref, onMounted } from "vue";
import { db, storage } from "../firebase";
import { ref as firebaseRef, deleteObject } from "firebase/storage";

import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

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
    const deleteProduct = async (id, uniqueFileName) => {
      if (confirm("Are you sure you want to delete")) {
        await deleteDoc(doc(productCollection, id));
        const desertRef = firebaseRef(storage, "images/" + uniqueFileName);
        deleteObject(desertRef)
          .then(() => {
            console.log(" File deleted successfully");
          })
          .catch((error) => {
            console.log(" Uh-oh, an error occurred!: " + error);
          });
        getProductData();
      }
    };
    return {
      products,
      deleteProduct,
      getProductData,
    };
  },
};
</script>
