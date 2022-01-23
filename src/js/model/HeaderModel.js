import {getDatabase, onValue, ref} from "firebase/database";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import ContentView from "../view/ContentView";

function HeaderModel() {
    let self = this;
    let headerView = null;
    const db = getDatabase();
    this.init = function (_headerView) {
        headerView = _headerView;
        let user = self.getStorage('user');
        console.log(user)
        if (user) {
            headerView.assignUser(user.username);
        }
    }
    this.getStorage = function (key) {
        return JSON.parse(localStorage.getItem(key));
    }
    this.setStorage = function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    this.login = function (email, password) {
        if (email && password) {
            const auth = getAuth();
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    self.getUser(user.email)
                    console.log(363, user)
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                });

        } else {
            // myAppView.loginError("Пустое поле Email или Password. Введите данные в указанные поля.");
        }
    }

    this.getUser = function (email){
        let id = 'id_'+email.replace('.', '_')
        const starCountRef = ref(db, id+'/');
        onValue(starCountRef, (snapshot) => {
            let data = snapshot.val();
            data.email = email;
            self.setStorage('user', data);
            headerView.assignUser(data.username);
            console.log(23232, data)
        });
    }

}
export default HeaderModel;
