import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
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
    this.openModalSignIn = function () {
        myModalView.openModalSignIn();
    }
    this.closeModal = function (modal) {
        myModalView.modalClose(modal);
    }

    this.registrateUser = function (email, password, userName, modal) {
        let flag = 1;
              myModalView.hideErrorHint();
        if (!userName) {
            myModalView.fillInNameField();
            flag = 0;
        }
        if (password.length < 6) {
            myModalView.fillInPasswordField();
            flag = 0;
        }

        if (email.indexOf(".") == -1 ||
            email.indexOf("@") == -1 ||
            email.indexOf(",") >=0 ||
            email.indexOf(" ") >= 0 || email.indexOf(";") >= 0) {
            myModalView.fillInEmailField();
            flag = 0;
        }

        if (flag) {
            // auth.name = userName;
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    user.username = userName;
                    let id = 'id_' + user.email.replace('.', '_');
                    set(ref(db, `${id}/username/`), userName).then(() => {
                        get(child(ref(db), `${id}/`)).then((snapshot) => {
                            let data = snapshot.val();
                            data.email = email;
                            self.setStorage('user', data);
                            window.location.reload();
                        });
                    });
                    this.closeModal(modal);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error(`Code: ${errorCode}, Error: ${errorMessage}`)

                });
        }
    }

}

export default ModalModel;