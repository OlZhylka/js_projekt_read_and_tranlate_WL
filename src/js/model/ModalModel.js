import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {child, get, getDatabase, ref, set} from "firebase/database";

function ModalModel() {
    let self = this;
    let myModalView = null;
    const db = getDatabase();
    this.init = function (modalView) {
        myModalView = modalView
    }

    this.goToRegistration = function () {
        myModalView.goToRegistration();
    }
    this.setStorage = function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    this.openModalSignIn=function (){
        myModalView.openModalSignIn();
    }
    this.closeModal=function (modalSingIn) {
        myModalView.modalClose(modalSingIn);
    }
    this.registrateUser= function (email,password,userName) {
        const auth = getAuth();
        // auth.name = userName;
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                user.username = userName;
                let id = 'id_' + user.email.replace('.', '_');
                set(ref(db, `${id}/username/`), userName).then(()=>{
                    get(child(ref(db), `${id}/`)).then((snapshot) => {
                        let data = snapshot.val();
                        data.email = email;
                        self.setStorage('user', data);
                        window.location.reload();
                    });
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(`Code: ${errorCode}, Error: ${errorMessage}`)
                // ..
            });
    }
}

export default ModalModel;