import {initializeApp} from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, onValue, set } from "firebase/database";


// import 'node-normalize-scss';
import '../css/style.scss';

window.reduce = "";

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
    /* ------- begin view for Header -------- */
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

    /* ------- end view for Header -------- */

    /* ------- begin view for NavBar -------- */
    function NavBarView() {
        let filters = null;
        let navBar = null;


        this.init = function (_filters) {
            navBar = document.getElementById("navBar");
            filters = _filters;
        }

        this.renderFilter = function (data) {
            for (let item in filters) {
                // if (filters.hasOwnProperty(item)) {
                navBar.innerHTML += filters[item].render(data);
                // }
            }
        }

    }

    /* ------- end view for NavBar -------- */


    /* ------- begin view for content-------- */
    function ContentView() {
        let myModuleContainer = null;
        let menu = null;
        let contentContainer = null;
        let routes = null;

        this.init = function (_container, _routes) {
            myModuleContainer = _container;
            routes = _routes;
            menu = myModuleContainer.querySelector("#mainmenu");
            contentContainer = myModuleContainer.querySelector("#content");
        }


        this.updateButtons = function (_currentPage) {
            const menuLinks = menu.querySelectorAll(".mainmenu__link");

            for (let link of menuLinks) {
                _currentPage === link.getAttribute("href").slice(1) ? link.classList.add("active") : link.classList.remove("active");
            }
        }

        this.renderContent = function (_hashPageName) {
            console.log(999888)
            let routeName = "default";

            if (_hashPageName.length > 0) {
                routeName = _hashPageName in routes ? _hashPageName : "error";
            }


            window.document.title = routes[routeName].title;
            contentContainer.innerHTML = routes[routeName].render(`${routeName}-page`);
            // this.updateButtons(routes[routeName].id);
        }

        this.insertContent = function (data) {
            const catalogSection = document.getElementById("catalogSection");
            routes['main'].insert(data, catalogSection);

        }

        this.insertBookDetails = function (data) {
            const bookDetails = document.getElementById("bookDetails");
            routes['book'].insert(data, bookDetails);
        }
        this.insertPlayer = function (player, data, play) {
            routes['book'].audio(player, data, play);
        }

        this.insertAccount = function (data) {
            const account = document.getElementById("account");
            routes['account'].insert(data, account);
        }
    };
    /* -------- end view for content--------- */

    /* ------- begin model for Header  ------- */
    function HeaderModel() {
        let self = this;
        let headerView = null;
        const db = getDatabase();
        this.init = function (_headerView) {
            headerView = _headerView;
            let user = self.getStorage('user');
            console.log(user)
            if (user) {
                headerView.assignUser(user.username);
            }
        }
        this.getStorage = function (key) {
            return JSON.parse(localStorage.getItem(key));
        }
        this.setStorage = function (key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        }
        this.login = function (email, password) {
            if (email && password) {
                const auth = getAuth();
                signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        self.getUser(user.email)
                        console.log(363, user)
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                    });

            } else {
                // myAppView.loginError("Пустое поле Email или Password. Введите данные в указанные поля.");
            }
        }

        this.getUser = function (email){
            let id = 'id_'+email.replace('.', '_')
            const starCountRef = ref(db, id+'/');
            onValue(starCountRef, (snapshot) => {
                let data = snapshot.val();
                data.email = email;
                self.setStorage('user', data);
                headerView.assignUser(data.username);
                console.log(23232, data)
            });
        }

    }


    /* ------- end model for Header  ------- */

    /* ------- begin model for NavBar ------- */
    function NavBarModel() {
        let self = this;
        let reduce2 = sessionStorage.getItem('authors')
        let myNavBarView = null;
        this.init = function (view) {
            myNavBarView = view;
            self.getAuthors();
        }

        this.getAuthors = async function () {
            let authors = null;
            if (reduce2) {
                console.log("aUUU", JSON.parse(reduce2));
                authors = JSON.parse(reduce2);
            } else {
                await fetch('https://wolnelektury.pl/api/authors/?format=json')
                    .then((response) => response.json())
                    .then((data) => {
                        sessionStorage.setItem('authors', JSON.stringify(data));
                        console.log("auth", data);
                        authors = data;
                    })
            }

            myNavBarView.renderFilter(authors);
            // return authors;   // Этот массив нам надо передать в селект. и чтобы он уже там был
            // при первой загрузке,поэтому вызываем его в контроллере
        }
        this.findBooksOfAuthor = function (_author) {
            let books = sessionStorage.getItem('books');
            books = JSON.parse(books);
            console.log(21, books);
            let booksOfAuthor = [];
            for (let key in books) {
                if (_author == books[key].author) {
                    booksOfAuthor.push(books[key]);
                }
            }
            reduce = JSON.stringify(booksOfAuthor);
            console.log(54, booksOfAuthor);
        }

    }


    /* ------- end model for NavBar ------- */


    /* ------- begin model for content ------- */
    function ContentModel() {
        let self = this;
        let myContentView = null;
        let slug = null;
        let clickLink = null;
        let offset = 0; //положение, с которого начинать читать массив
        let chapter = 0;
        this.init = function (view) {
            myContentView = view;
        }

        this.getStorage = function (storage, key) {
            if (storage == 'local') {
                return JSON.parse(localStorage.getItem(key))
            } else if (storage == 'session') {
                return  JSON.parse(sessionStorage.getItem(key))
            }
        }
        this.setStorage = function (storage, key, value) {
            if (storage == 'local') {
                localStorage.setItem(key, JSON.stringify(value));
            } else if (storage == 'session') {
                sessionStorage.setItem(key, JSON.stringify(value));
            }
        }
        reduce = self.getStorage('session', 'books');
        this.updateState = async function (_pageName) {
            let data = null;
            offset = 0;
// _pageName -- это хвост от url страницы
            myContentView.renderContent(_pageName);
            if (_pageName == 'main' || !_pageName) {
                data = await self.getBooks();
                myContentView.insertContent(data)
            } else if (_pageName == 'book') {
                console.log(333333333333333)
                await self.getBook();
                self.setChapter(1);
            } else if (_pageName == 'account') {
                self.workAccount()
            }

        }

        this.insertContent = async function () {
            let data = await self.getBooks();
            myContentView.insertContent(data);
        }

        this.getBooks = async function () {
            let item = null;
            let index = 9;
            let books = [];
            if (reduce) {
                item = reduce;
            } else {
                await fetch('https://wolnelektury.pl/api/books/?format=json')
                    .then((response) => response.json())
                    .then((data) => {
                        self.setStorage('session', 'books', data);
                        item = data;
                        reduce = self.getStorage('session', 'books');
                    })
            }

            index = item.length < index ? item.length : index;
            if (offset + index > item.length) {
                index = item.length - offset;
            }
            for (let i = offset; i < (offset + index); i++) {
                if (item) {
                    books.push(item[i]) //постепенно формируем новый массив
                }
            }
            if (offset + index < item.length) {
                offset += index;
            } else {
                books.push('end')
            }
            // начинаем читать следующие 9 элементов
            return books;
        }

        this.setSlug = function (bookSlug){
            console.log(33333444444, bookSlug)
            slug = bookSlug;
            clickLink = true;
        }

        this.getBook = async function () {
            console.log(1515155555, clickLink, slug)
            let singleBook = self.getStorage('local', 'singleBook');
            if (singleBook && !clickLink) {
                console.log(566666555555555)
                myContentView.insertBookDetails(singleBook);
                clickLink = null;
            } else {
                console.log(66666666655555555)
                await fetch(`https://wolnelektury.pl/api/books/${slug}?format=json`)
                    .then((response) => response.json())
                    .then((data) => {
                        data.slug = slug;
                        console.log(151515, data, slug)
                        self.setStorage('local', 'singleBook', data);
                        myContentView.insertBookDetails(data);
                    }).catch((e)=>{
                        console.error('Error:'+e)
                    })
            }
            chapter = 0;
            self.setPlayer();
        }

        this.workAccount = function () {
            myContentView.insertAccount()
        }

        this.setChapter = function (check) {
            if (check) {
                chapter++;
            } else {
                chapter--;
            }
        }
        this.setPlayer = function () {
            let player = document.getElementById('player');
            if (player) {
                let mp3 = [];
                let data = self.getStorage('local', 'singleBook');
                for (let i in data.media) {
                    if (data.media[i].type == "mp3") {
                        mp3.push(data.media[i])
                    }
                }
                myContentView.insertPlayer(player, mp3[chapter]);
                let audioPlayer = player.querySelector("#audioPlayer");
                if (audioPlayer) {
                    audioPlayer.addEventListener('ended', function () {
                        myContentView.insertPlayer(player, mp3[chapter], "play");
                    });
                }
            }
        }

        this.setUserBook = function () {
            let user = self.getStorage('local', 'user');
            let book = self.getStorage('local', 'singleBook');

            console.log(8989898989, user, book.slug)
            let id = 'id_'+user.email.replace('.', '_')
            const db = getDatabase();
            let books = {
                title: book.title,
                cover_thumb: book.cover_thumb,
                author: book.authors[0].name
                };
            set(ref(db, id+'/books/'+book.slug+'/'),books);
        }

    }

    /* -------- end model for content -------- */

    /* ----- begin controller ---- */
    function ModuleController() {
        let self = this;
        let myModuleContainer = null;
        let myContentModel = null;
        let myNawBarModel = null;
        let myHeaderModel = null;

        this.init = function (root, modelContent, modelNavBar,modelHeader) {

            myModuleContainer = root;
            myContentModel = modelContent;
            myNawBarModel = modelNavBar;
            myHeaderModel = modelHeader;

            const buttonFind = document.querySelector("button.button__find");
            const buttonSingIn = document.getElementById("singIn");
            const modalSingIn = document.getElementById("modal_singIn");
            const modalBackground = document.getElementById("modal_background");
            const closeSingIn = modalSingIn.querySelector(".close");
            const buttonSubmit = modalSingIn.querySelector(".button__enter");

            buttonFind.addEventListener("click", getListOfBooks);
            buttonSingIn.addEventListener("click", openModalSingIn);
            closeSingIn.addEventListener("click", closeModalSingIn);
            buttonSubmit.addEventListener("click", submitSingIn);

            function getListOfBooks() {
                let authorSingle = document.getElementById("authors").value;
                myNawBarModel.findBooksOfAuthor(authorSingle);
                window.resultBooks = "";
                self.updateState();
                // console.log(36,authorSingle.value);
            }

            function openModalSingIn() {
                modalSingIn.classList.remove("disabled");
                modalBackground.classList.remove("disabled");
            }

            function closeModalSingIn() {
                modalSingIn.classList.add("disabled");
                modalBackground.classList.add("disabled");
            }
            function submitSingIn() {
                let email = document.getElementById("userEmail")
                let password = document.getElementById("userPass")
                console.log(email.value, password.value);
                myHeaderModel.login(email.value, password.value)
              closeModalSingIn();
            }

            // вешаем слушателей на событие hashchange и кликам по пунктам меню
            window.addEventListener("hashchange", this.updateState);

            // myModuleContainer.querySelector("#mainmenu").addEventListener("click", function (event) {
            //     event.preventDefault();
            //     window.location.hash = event.target.getAttribute("href");
            // });

            this.updateState(); //первая отрисовка
        }

        this.updateState = async function (offset) {
            const hashPageName = location.hash.slice(1).toLowerCase();
            await myContentModel.updateState(hashPageName, offset);

            function inView() {
                let end = document.getElementById('end')

                if (document.getElementById("spa").getBoundingClientRect().bottom <= window.innerHeight && !end) {
                    console.log('inView', window.innerHeight);
                    myContentModel.insertContent();
                    // uncomment below if you only want it to notify once
                    // document.removeEventListener("scroll", inView);
                }
            }

            window.removeEventListener("click", inView);
            if (hashPageName == "main" || !hashPageName) {
                const catalogSection = document.getElementById("catalogSection");
                window.addEventListener("scroll", inView);
                catalogSection.addEventListener("click", function (e) {
                    console.log(45454545, e.target)
                    if (e.target.dataset.slug) {
                        myContentModel.setSlug(e.target.dataset.slug);
                        self.updateState(e.target.dataset.slug, true);
                    }
                })
            } else if (hashPageName == "book") {
                const prevAudio = document.getElementById("prevAudio");
                if (prevAudio) {
                    prevAudio.addEventListener("click", function () {
                        myContentModel.setChapter(0);
                        myContentModel.setPlayer()
                        console.log(111111)
                    })
                }
                const nextAudio = document.getElementById("nextAudio");
                if (nextAudio) {
                    nextAudio.addEventListener("click", function () {
                        myContentModel.setChapter(1);
                        myContentModel.setPlayer()
                        console.log(2222222)
                    })
                }
                let buttonAddToMe = document.getElementById("addingBook");
                let buttonAdd = buttonAddToMe.querySelector("svg");
                buttonAdd.addEventListener("click", soundAndFillClick);
                console.log(4343435, buttonAdd)
                // Добавлен звук и цвет по клику
                function soundAndFillClick() {
                    let shortSound = new Audio(); // Создаём новый элемент Audio
                    shortSound.src = 'sound/add.mp3'; // Указываем путь к звуку "клика"
                    shortSound.autoplay = true; // Автоматически запускаем
                    buttonAddToMe.querySelector("path").style.fill = "#31bf4e";
                    myContentModel.setUserBook()
                }


            }
        }
        this.startPlayer = function () {

        }
    }

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
