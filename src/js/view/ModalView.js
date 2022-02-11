function ModalView() {
    let modalSignUp = null;
    let modalSignIn = null;
    let modalBackGround = null;
    let incorrectFillingName =  null;
    let incorrectFillingPassword =  null;
    let incorrectFillingEmail =  null;
    this.init = function () {
        modalSignUp = document.getElementById('modal_singUp');
        modalSignIn = document.getElementById("modal_singIn");
        modalBackGround = document.getElementById("modal_background");
        incorrectFillingName = modalSignUp.querySelector("#incorrectFillingName");
        incorrectFillingPassword = modalSignUp.querySelector("#incorrectFillingPassword");
        incorrectFillingEmail = modalSignUp.querySelector("#incorrectFillingEmail");
    }
    this.goToRegistration = function () {
        modalSignUp.classList.remove("hide");
        modalSignIn.classList.add("hide");
    }
    this.openModalSignIn = function () {
        modalSignIn.classList.remove("hide");
        modalBackGround.classList.remove("hide");
    }
      this.modalClose = function (modal) {
        modal.classList.add("hide");
        modalBackGround.classList.add("hide");
    }

    this.fillInNameField = function () {

        incorrectFillingName.classList.remove("hide");

    }
    this.fillInPasswordField = function () {

        incorrectFillingPassword.classList.remove("hide");
    }
    this.fillInEmailField = function () {

        incorrectFillingEmail.classList.remove("hide");
    }
    this.hideErrorHint = function () {
        incorrectFillingName.classList.add("hide");
        incorrectFillingEmail.classList.add("hide");
        incorrectFillingPassword.classList.add("hide");
    }

}

export default ModalView;