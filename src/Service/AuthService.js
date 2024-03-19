import { useStore } from "vuex";
class AuthService {
    getCurrentUser() {
        let user = JSON.parse(localStorage.getItem('userLogin'));
        return user;
    }
    isLogin() {
        if (this.getCurrentUser() !== null) {
            return true;
        }
        return false;
    }
    isAdmin(){
        const user = this.getCurrentUser();
        if(user && user.role === 'admin'){
            console.log(user.role);
            return true;
        }
        return false;
    }
    checkLogin(){
        const user = this.getCurrentUser();
        const store = useStore();
        if (user) {
            store.commit("setIsLogin", true);
            if (this.isAdmin()) {
                store.commit("setIsAdmin", true);
            }
        }
    }
}
export default new AuthService();