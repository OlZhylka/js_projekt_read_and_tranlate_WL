function HeaderView() {
    let header = null;

    this.init = function () {
        header = document.getElementById('header');
    }

    this.assignUser = function (name){
        let singIn = header.querySelector('#singIn');
        let enter = header.querySelector('#enter');
        let userName = header.querySelector('#userName');
        singIn.classList.add('disabled');
        enter.classList.remove('disabled');
        userName.innerText = name;
    }
}
export default HeaderView;