<template>
  <div class="wrapper">
    <div class="card">
      <form @submit.prevent="login" class="d-flex flex-column">
        <div class="h3 text-center text-white">Login</div>
        <div class="d-flex align-items-center input-field my-3 mb-4">
          <span class="far fa-user p-2"></span>
          <input
            type="text"
            placeholder="Username or Email"
            required
            class="form-control"
            v-model="email"
          />
        </div>
        <div class="d-flex align-items-center input-field mb-4">
          <span class="fas fa-lock p-2"></span>
          <input
            type="password"
            placeholder="Password"
            required
            class="form-control"
            id="pwd"
            minlength="6"
            v-model="password"
          />
          <button class="btn" onclick="showPassword()">
            <span class="fas fa-eye-slash"></span>
          </button>
        </div>
        <div class="my-3">
          <input type="submit" value="Login" class="btn btn-primary" />
        </div>
        <div class="mb-3">
          <span class="text-light-white">Don't have an account? </span>
          <a href="/register">Register</a>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../../firebase";
import { useRouter } from "vue-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useStore } from "vuex";
export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const store = useStore();
    const getUsers = async (email) => {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      let userLogin = {};
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        userLogin = {
          id: doc.data().id,
          email: doc.data().email,
          role: doc.data().role,
        };
      });
      localStorage.setItem("userLogin", JSON.stringify(userLogin));
       store.commit("setIsLogin", true);
        console.log("xxxx:" + store.state.isLogin);
         if (userLogin.role === "admin") {
          store.commit("setIsAdmin", true);
          console.log(store.state.isAdmin);
        }
      console.log("json: " + JSON.parse(localStorage.getItem("userLogin")));
    };

    const login = async () => {
      await signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
          const user = userCredential.user;
          getUsers(user.email);


          alert("Welcome back");
          router.push("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + ": " + errorMessage);
        });
    };
    return {
      email,
      password,
      login,
    };
  },
};
</script>

  <style>
/* Importing fonts from Google */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap");

/* Reseting */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

body {
  background: linear-gradient(135deg, #00c3ff, #eeef1c);
  background: linear-gradient(135deg, #fc00ff, #00dbde);
  background-image: linear-gradient(135deg, #ff00ba 0%, #fae713 100%);
  background-image: linear-gradient(
    150deg,
    #5a00ff 0%,
    #ff1ff7 100%,
    #ff1ff7 100%
  );
  min-height: 100vh;
}

.wrapper {
  max-width: 500px;
  margin: 50px auto;
}

.wrapper .card {
  max-width: 400px;
  min-height: 300px;
  margin: 30px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  cursor: pointer;
  padding: 0.8rem;
}

.wrapper .card a {
  text-decoration: none;
  color: #eee;
}

.wrapper .card a:hover {
  color: #fff;
}

.wrapper .card .input-field {
  border: 1px solid #ddd;
  border-radius: 5px;
  color: #eee;
  padding: 0.3rem;
}

.wrapper .card .input-field input {
  background-color: inherit;
}

.wrapper .card .input-field input.form-control,
.wrapper .card .input-field input.form-control:focus {
  border: none;
  outline: none;
  box-shadow: none;
  color: #eee;
}

.wrapper .card .input-field button.btn {
  color: #eee;
  padding: 0rem;
  padding-right: 0.5rem;
}

.wrapper .card .input-field button.btn:hover {
  color: #fff;
}

.wrapper .card .input-field button.btn:focus {
  border: none;
  outline: none;
  box-shadow: none;
}

.wrapper .card .input-field input::placeholder {
  color: #eee;
}

.wrapper .card .option {
  display: block;
  position: relative;
  padding-left: 25px;
  cursor: pointer;
  user-select: none;
}

.wrapper .card .option span.text-light-white:hover {
  color: #fff;
}

.wrapper .card .option input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 3px;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #fff;
  border-radius: 2px;
}

.wrapper .card .option:hover input ~ .checkmark {
  background-color: #f1f1f1;
}

.wrapper .card .option input:checked ~ .checkmark {
  border: none;
  background-color: #333;
  transition: 300ms ease-in-out all;
}

.checkmark:after {
  content: "\2713";
  position: absolute;
  display: none;
  color: #fff;
  font-size: 1rem;
}

.wrapper .card .option input:checked ~ .checkmark:after {
  display: block;
}

.wrapper .card .option .checkmark:after {
  left: 3px;
  top: -3px;
  width: 5px;
  height: 10px;
}

.wrapper .card .btn.btn-primary {
  border-radius: 20px;
  width: 100px;
  background-color: #fff;
  color: #333;
  border: none;
}

.wrapper .card .btn.btn-primary:hover {
  color: #fff;
  background: #333;
}

.wrapper .card .btn.btn-primary:focus {
  border: none;
  box-shadow: none;
}

.wrapper .card .text-light-white {
  color: #ddd;
}

.wrapper .card .line span.connect {
  position: absolute;
  top: -12px;
  left: 33%;
  color: #000;
  padding: 0 0.3rem;
  z-index: 100;
  border-radius: 2px;
  background-color: #fff;
}

.wrapper .card .connections a img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

@media (max-width: 370px) {
  .wrapper .card .line:after {
    left: 27%;
  }
}

@media (max-width: 350px) {
  .wrapper {
    margin: 10px auto;
  }

  .wrapper .card {
    margin: 10px;
  }
}
</style>