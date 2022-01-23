const SingIn = {

    render: () => {
        // let modalSingIn = document.createElement("div");
        // modalSingIn.id="modal_singIn";
        // modalSingIn.classList.add("singIn-form");
        // modalSingIn.classList.add("form");

        return `
<div id="modal_singIn" class="form disabled">
    <div class="close"></div>
    <h2 class="title_form">Добро пожаловать!</h2>
    <div class="rowForm">
        <div>Your E-mail: </div>
        <input type="email" id="userEmail">
        <div>Password: </div>
        <input type="password" id="userPass">
        <button class="button__enter">Войти</button>
    </div>
</div>
<div id="modal_background" class="disabled"></div>
      `;
    }

};

export default SingIn;
