const Modals = {

    render: () => {
        // let modalSingIn = document.createElement("div");
        // modalSingIn.id="modal_singIn";
        // modalSingIn.classList.add("modals-form");
        // modalSingIn.classList.add("form");

        return `
<div id="modal_singIn" class="form hide">
    <div class="close"></div>
    <h3 >Добро пожаловать!</h3>
    <div class="rowForm">
        <div>E-mail: </div>
        <input type="email" id="userEmail">
        <div>Password: </div>
        <input type="password" id="userPass">
     </div>
       <button class="button__signUp" id="registration">Регистрация</button>
       <button class="button__enter" id="submit">Войти</button>
      
        
  </div>
    
  <div id="modal_singUp" class="form hide">
    <div class="close"></div>
    <h3 >Регистрация</h3>
    <div class="rowForm">
        <div>Your name: </div>
        <input type="userName" id="newUserName">
        <div>Your E-mail: </div>
        <input type="email" id="newEmail">
        <div>Password: </div>
        <input type="password" id="newPass">
     </div>
         <button class="button__enter" id="OK">OK</button>
  
</div>

<div id="modal_background" class="hide"></div>
      `;
    }

};

export default Modals;
