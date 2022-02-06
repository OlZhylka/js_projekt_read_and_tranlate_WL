require('webpack-jquery-ui');
require('webpack-jquery-ui/css');

import {initializeApp} from "firebase/app";

import '../scss/style.scss';

// глобальная переменная для работы с каталогом книг (см. ContentModel 34 ...)
window.reduce = "";

import HeaderView from './view/HeaderView.js';
import NavBarView from './view/NavBarView.js';
import ContentView from './view/ContentView.js';
import ModalView from './view/ModalView.js';

import HeaderModel from './model/HeaderModel.js';
import NavBarModel from './model/NavBarModel.js';
import ContentModel from './model/ContentModel.js';
import ModalModel from './model/ModalModel.js';

import ModuleController from './controller/ModuleController.js';

import HomePage from './pages/HomePage.js';
import Book from './pages/Book.js';
import Account from './pages/Account.js';
import ListOfWords from './pages/ListOfWords.js';
import About from './pages/About.js';
import Contacts from './pages/Contacts.js';
import ReadPage from './pages/ReadPage.js';
import ErrorPage from './pages/ErrorPage.js';

import VocabularyForm from './form/VocabularyForm.js';

import FilterAuthors from './filters/FilterAuthors.js';
import FilterGenres from './filters/FilterGenres.js';
import FilterKinds from './filters/FilterKinds.js';

import Navbar from './components/NavBar.js';
import Header from './components/Header.js';
import Modals from './components/Modals.js';
import Footer from './components/Footer.js';

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
    modals: Modals,
    footer: Footer,
}

const routes = {
    main: HomePage,
    book: Book,
    read: ReadPage,
    account: Account,
    about: About,
    contacts: Contacts,
    listofwords: ListOfWords,
    default: HomePage,
    error: ErrorPage,
};

const filters = {
    vocabulary: VocabularyForm,
    authors: FilterAuthors,
    genres: FilterGenres,
    kinds: FilterKinds,
}

/* ----- spa init module --- */
const mySPA = (function () {
    return {
        init: async function (root, routes, components) {
            this.renderComponents(root, components);

            const contentView = new ContentView();
            const navBarView = new NavBarView();
            const headerView = new HeaderView();
            const modalView = new ModalView();
            const contentModel = new ContentModel();
            const navBarModel = new NavBarModel();
            const headerModel = new HeaderModel();
            const modalModel = new ModalModel();
            const controller = new ModuleController();

            //связываем части модуля
            // инициализация View
            contentView.init(document.getElementById(root), routes);
            navBarView.init(filters);
            headerView.init();
            modalView.init();
            // инициализация Model
            contentModel.init(contentView);
            await navBarModel.init(navBarView);
            headerModel.init(headerView);
            modalModel.init(modalView)
            // инициализация Controller
            controller.init(document.getElementById(root), contentModel, navBarModel,headerModel,modalModel);
        },

        // отрисовываем страницу
        renderComponents: function (root, components) {
            const container = document.getElementById(root);
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
