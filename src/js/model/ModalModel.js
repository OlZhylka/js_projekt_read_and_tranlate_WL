import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

function ModalModel() {
    let self = this;
    let myModalView = null;
    this.init = function (modalView) {
        myModalView = modalView
    }

    this.goToRegistration = function () {
        myModalView.goToRegistration();
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
                // Signed in
                const user = userCredential.user;
                // ...
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