<template>
  <table class="table table-bordered table-striped rounded shadow">
    <thead>
      <tr>
        <th scope="col">Full Name</th>
        <th scope="col">Phone Number</th>
        <th scope="col">Address</th>
        <th scope="col">Products</th>
        <th scope="col">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in filteredOrders" :key="order.id">
        <td>{{ order.full_name }}</td>
        <td>0{{ order.phone }}</td>
        <td>{{ order.address }}</td>
        <td>{{ order.products }}</td>
        <td>{{ order.total }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { ref, onMounted } from "vue";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "vue-router";

export default {
  setup() {
    const filteredOrders = ref([]);
    const userLogin = JSON.parse(localStorage.getItem("userLogin"));
    const router = useRouter();

    const orderCollection = collection(db, "orders");

    const getOrderData = async () => {
      const querySnapshot = await getDocs(orderCollection);
      const fbOrders = [];
      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
    
        if (orderData.userId === userLogin.id) {
          fbOrders.push({
            id: doc.id,
            full_name: orderData.full_name,
            phone: orderData.phone,
            address: orderData.address,
            products: orderData.products,
            total: orderData.total,
          });
        }
      });
      filteredOrders.value = fbOrders; // Update filteredOrders
    };

    onMounted(async () => {
      await getOrderData();
      
      if (filteredOrders.value.length === 0) {
        router.push("/");
      }
    });

    return {
      filteredOrders,
    };
  },
};
</script>

