function ModalView() {
    let modalSignUp = null;
    let modalSignIn = null;
    let modalBackGround=null;
    this.init = function () {
        modalSignUp = document.getElementById('modal_singUp');
        modalSignIn= document.getElementById("modal_singIn");
        modalBackGround= document.getElementById("modal_background");
    }
    this.goToRegistration=function (){
        modalSignUp.classList.remove("hide");
        modalSignIn.classList.add("hide");
    }
    this.openModalSignIn = function (){
        modalSignIn.classList.remove("hide");
        modalBackGround.classList.remove("hide");
    }
    this.modalClose = function (modal){
        modal.classList.add("hide");
        modalBackGround.classList.add("hide");
    }


}
export default ModalView;