function HeaderView() {
    let header = null;
    let buttonEnter=null;
    let buttonSignOut= null;
    let buttonsignIn=null;
    let userName = null
    this.init = function () {
        header = document.getElementById('header');
        buttonsignIn = header.querySelector('#signIn');
        buttonEnter= document.getElementById("enter");
        buttonSignOut= document.getElementById("signOut");
        userName = header.querySelector('#userName');
    }

    this.assignUser = function (name){
        userName.classList.remove('hide')
        buttonSignOut.classList.remove('hide')
        buttonsignIn.classList.add('hide');
        buttonEnter.classList.remove('hide');
        userName.innerText = name;
    }
    this.signOutUser = function (){
        userName.classList.add('hide')
        buttonSignOut.classList.add('hide')
        buttonsignIn.classList.remove('hide');
        buttonEnter.classList.add('hide');
        userName.innerText = "";
    }
    this.showButtonOut =function () {

        buttonEnter.classList.add("hide");
        buttonSignOut.classList.remove("hide");
    }
    this.hideButtonOut = function () {
        buttonEnter.classList.remove("hide");
        buttonSignOut.classList.add("hide");
    }
}
export default HeaderView;