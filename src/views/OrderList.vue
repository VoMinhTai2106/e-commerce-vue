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
      <tr v-for="order in orders" :key="order.id">
      <td>{{order.full_name}}</td>
      <td>0{{order.phone}}</td>
      <td>{{order.address}}</td>
      <td>{{order.products}}</td>
      <td>{{order.total}}</td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { ref, onMounted } from "vue";
import { db } from "@/firebase";
import { collection, getDocs} from "firebase/firestore";

export default {
  setup() {
    const orders = ref({});
    const orderCollection = collection(db, "orders");
    const getOrderData = async () => {
      const querySnapshot = await getDocs(orderCollection);
      let fbOrders = [];
      querySnapshot.forEach((doc) => {
        const order = {
          id: doc.id,
          full_name: doc.data().full_name,
          phone: doc.data().phone,
          address: doc.data().address,
          products: doc.data().products,
          total: doc.data().total,
        };
        fbOrders.push(order);
      });
      orders.value = fbOrders;
    };
    onMounted(async () => {
      await getOrderData();
    });
    
    return {
      orders,
      getOrderData,
    };
  },
};
</script>