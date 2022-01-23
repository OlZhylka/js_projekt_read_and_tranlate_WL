import {initializeApp} from "firebase/app";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { getDatabase, ref, onValue, set } from "firebase/database";

// import 'node-normalize-scss';
import '../css/style.scss';

window.reduce = "";

import HeaderView from './view/HeaderView.js';
import NavBarView from './view/NavBarView.js';
import ContentView from './view/ContentView.js';

import HeaderModel from './model/HeaderModel.js';
import NavBarModel from './model/NavBarModel.js';
import ContentModel from './model/ContentModel.js';

import ModuleController from './controller/ModuleController.js';

import HomePage from './pages/HomePage.js';
import Book from './pages/Book.js';
import Account from './pages/Account.js';
import About from './pages/About.js';
import Contacts from './pages/Contacts.js';
import ErrorPage from './pages/ErrorPage.js';

import FilterAuthors from './filters/FilterAuthors.js';

import Navbar from './components/NavBar.js';
import Header from './components/Header.js';
import SingIn from './components/SingIn.js';

import ContentContainer from './components/ContentContainer.js';

//********************************************************************

//Инициализация firebase. Возможно. поменяется место расположения
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBGRxzGYOUQwlxCsb6CfgIGyfy7nPgckiM",
    authDomain: "read-and-tranlate-1f7ec.firebaseapp.com",
    databaseURL: "https://read-and-tranlate-1f7ec-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "read-and-tranlate-1f7ec",
    storageBucket: "read-and-tranlate-1f7ec.appspot.com",
    messagingSenderId: "19101192182",
    appId: "1:19101192182:web:7fc4511718b58217fd81d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//********************************************************************


const components = {
    header: Header,
    navbar: Navbar,
    content: ContentContainer,
    singIn: SingIn,
}

const routes = {
    main: HomePage,
    book: Book,
    account: Account,
    about: About,
    contacts: Contacts,
    default: HomePage,
    error: ErrorPage,
};

const filters = {
    authors: FilterAuthors,
//     genres: FilterGenres,
//     kinds: FilterKinds,
}

/* ----- spa init module --- */
const mySPA = (function () {

    /* ----- begin controller ---- */
    // function ModuleController() {
    //     let self = this;
    //     let myModuleContainer = null;
    //     let myContentModel = null;
    //     let myNawBarModel = null;
    //     let myHeaderModel = null;
    //
    //     this.init = function (root, modelContent, modelNavBar,modelHeader) {
    //
    //         myModuleContainer = root;
    //         myContentModel = modelContent;
    //         myNawBarModel = modelNavBar;
    //         myHeaderModel = modelHeader;
    //
    //         const buttonFind = document.querySelector("button.button__find");
    //         const buttonSingIn = document.getElementById("singIn");
    //         const modalSingIn = document.getElementById("modal_singIn");
    //         const modalBackground = document.getElementById("modal_background");
    //         const closeSingIn = modalSingIn.querySelector(".close");
    //         const buttonSubmit = modalSingIn.querySelector(".button__enter");
    //
    //         buttonFind.addEventListener("click", getListOfBooks);
    //         buttonSingIn.addEventListener("click", openModalSingIn);
    //         closeSingIn.addEventListener("click", closeModalSingIn);
    //         buttonSubmit.addEventListener("click", submitSingIn);
    //
    //         function getListOfBooks() {
    //             let authorSingle = document.getElementById("authors").value;
    //             myNawBarModel.findBooksOfAuthor(authorSingle);
    //             window.resultBooks = "";
    //             self.updateState();
    //             // console.log(36,authorSingle.value);
    //         }
    //
    //         function openModalSingIn() {
    //             modalSingIn.classList.remove("disabled");
    //             modalBackground.classList.remove("disabled");
    //         }
    //
    //         function closeModalSingIn() {
    //             modalSingIn.classList.add("disabled");
    //             modalBackground.classList.add("disabled");
    //         }
    //         function submitSingIn() {
    //             let email = document.getElementById("userEmail")
    //             let password = document.getElementById("userPass")
    //             console.log(email.value, password.value);
    //             myHeaderModel.login(email.value, password.value)
    //           closeModalSingIn();
    //         }
    //
    //         // вешаем слушателей на событие hashchange и кликам по пунктам меню
    //         window.addEventListener("hashchange", this.updateState);
    //
    //         // myModuleContainer.querySelector("#mainmenu").addEventListener("click", function (event) {
    //         //     event.preventDefault();
    //         //     window.location.hash = event.target.getAttribute("href");
    //         // });
    //
    //         this.updateState(); //первая отрисовка
    //     }
    //
    //     this.updateState = async function (offset) {
    //         const hashPageName = location.hash.slice(1).toLowerCase();
    //         await myContentModel.updateState(hashPageName, offset);
    //
    //         function inView() {
    //             let end = document.getElementById('end')
    //
    //             if (document.getElementById("spa").getBoundingClientRect().bottom <= window.innerHeight && !end) {
    //                 console.log('inView', window.innerHeight);
    //                 myContentModel.insertContent();
    //                 // uncomment below if you only want it to notify once
    //                 // document.removeEventListener("scroll", inView);
    //             }
    //         }
    //
    //         window.removeEventListener("click", inView);
    //         if (hashPageName == "main" || !hashPageName) {
    //             const catalogSection = document.getElementById("catalogSection");
    //             window.addEventListener("scroll", inView);
    //             catalogSection.addEventListener("click", function (e) {
    //                 console.log(45454545, e.target)
    //                 if (e.target.dataset.slug) {
    //                     myContentModel.setSlug(e.target.dataset.slug);
    //                     self.updateState(e.target.dataset.slug, true);
    //                 }
    //             })
    //         } else if (hashPageName == "book") {
    //             const prevAudio = document.getElementById("prevAudio");
    //             if (prevAudio) {
    //                 prevAudio.addEventListener("click", function () {
    //                     myContentModel.setChapter(0);
    //                     myContentModel.setPlayer()
    //                     console.log(111111)
    //                 })
    //             }
    //             const nextAudio = document.getElementById("nextAudio");
    //             if (nextAudio) {
    //                 nextAudio.addEventListener("click", function () {
    //                     myContentModel.setChapter(1);
    //                     myContentModel.setPlayer()
    //                     console.log(2222222)
    //                 })
    //             }
    //             let buttonAddToMe = document.getElementById("addingBook");
    //             let buttonAdd = buttonAddToMe.querySelector("svg");
    //             buttonAdd.addEventListener("click", soundAndFillClick);
    //             console.log(4343435, buttonAdd)
    //             // Добавлен звук и цвет по клику
    //             function soundAndFillClick() {
    //                 let shortSound = new Audio(); // Создаём новый элемент Audio
    //                 shortSound.src = 'sound/add.mp3'; // Указываем путь к звуку "клика"
    //                 shortSound.autoplay = true; // Автоматически запускаем
    //                 buttonAddToMe.querySelector("path").style.fill = "#31bf4e";
    //                 myContentModel.setUserBook()
    //             }
    //
    //
    //         }
    //     }
    //     this.startPlayer = function () {
    //
    //     }
    // }

    /* ------ end controller ----- */

    return {
        init: function (root, routes, components) {
            this.renderComponents(root, components);

            const contentView = new ContentView();
            const navBarView = new NavBarView();
            const headerView = new HeaderView();
            const contentModel = new ContentModel();
            const navBarModel = new NavBarModel();
            const headerModel = new HeaderModel();
            const controller = new ModuleController();

            //связываем части модуля
            contentView.init(document.getElementById(root), routes);
            navBarView.init(filters);
            headerView.init();
            contentModel.init(contentView);
            navBarModel.init(navBarView);
            headerModel.init(headerView);
            controller.init(document.getElementById(root), contentModel, navBarModel,headerModel);
        },

        renderComponents: function (root, components) {
            const container = document.getElementById(root);
            console.log(components);
            for (let item in components) {
                if (components.hasOwnProperty(item)) {
                    container.innerHTML += components[item].render();
                }
            }
        },
    };

}());
/* ------ end app module ----- */

/*** --- init module --- ***/
mySPA.init("spa", routes, components);
