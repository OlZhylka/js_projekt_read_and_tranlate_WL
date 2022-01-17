import '../css/style.scss';

window.reduce = "";

import HomePage from './pages/HomePage.js';
import Book from './pages/Book.js';
import About from './pages/About.js';
import Contacts from './pages/Contacts.js';
import ErrorPage from './pages/ErrorPage.js';

import FilterAuthors from './filters/FilterAuthors.js';

import Navbar from './components/NavBar.js';
import Header from './components/Header.js';

import ContentContainer from './components/ContentContainer.js';

const components = {
    header: Header,
    navbar: Navbar,
    content: ContentContainer,
}

const routes = {
    main: HomePage,
    book: Book,
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

        this.insertBookDetails = function (data){
            const bookDetails = document.getElementById("bookDetails");
            routes['book'].insert(data, bookDetails);
        }
    };
    /* -------- end view for content--------- */


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
        reduce = sessionStorage.getItem('books');
        let offset = 0; //положение, с которого начинать читать массив

        this.init = function (view) {
            myContentView = view;
        }

        this.updateState = async function (_pageName) {
            let data = null;
            offset = 0;
// _pageName -- это хвост от url страницы
            myContentView.renderContent(_pageName);
            if (_pageName == 'main' || !_pageName) {
                data = await self.getBooks();
                myContentView.insertContent(data)
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
                console.log(222, JSON.parse(reduce));
                item = JSON.parse(reduce);
            } else {
                await fetch('https://wolnelektury.pl/api/books/?format=json')
                    .then((response) => response.json())
                    .then((data) => {
                        sessionStorage.setItem('books', JSON.stringify(data));
                        console.log(123, data);
                        item = data;

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

        this.getBook = function (slug) {
            fetch(`https://wolnelektury.pl/api/books/${slug}?format=json`)
                .then((response) => response.json())
                .then((data) => {
                    // sessionStorage.setItem('book', JSON.stringify(data));
                    console.log("book", data);
                    myContentView.insertBookDetails(data);
                })
        }

    }

    /* -------- end model for content -------- */

    /* ----- begin controller ---- */
    function ModuleController() {
        let self = this;
        let myModuleContainer = null;
        let myContentModel = null;
        let myNawBarModel = null;

        this.init = function (root, modelContent, modelNavBar) {

            myModuleContainer = root;
            myContentModel = modelContent;
            myNawBarModel = modelNavBar;

            const buttonFind = document.querySelector("button.button__find");

            buttonFind.addEventListener("click", getListOfBooks);

            function getListOfBooks() {
                let authorSingle = document.getElementById("authors").value;
                myNawBarModel.findBooksOfAuthor(authorSingle);
                window.resultBooks = "";
                self.updateState();
                // console.log(36,authorSingle.value);
            }

            // вешаем слушателей на событие hashchange и кликам по пунктам меню
            window.addEventListener("hashchange", this.updateState);

            // myModuleContainer.querySelector("#mainmenu").addEventListener("click", function (event) {
            //     event.preventDefault();
            //     window.location.hash = event.target.getAttribute("href");
            // });

            document.addEventListener("scroll", inView);

            function inView() {
                let end = document.getElementById('end')
                if (document.getElementById("spa").getBoundingClientRect().bottom <= window.innerHeight && !end) {
                    console.log('inView', window.innerHeight);
                    myContentModel.insertContent();
                    // uncomment below if you only want it to notify once
                    // document.removeEventListener("scroll", inView);
                }
            }

            this.updateState(); //первая отрисовка


        }

        this.updateState = function (offset) {
            const hashPageName = location.hash.slice(1).toLowerCase();
            myContentModel.updateState(hashPageName, offset);
            const catalogSection = document.getElementById("catalogSection");
            if (catalogSection) {
                catalogSection.addEventListener("click", function (e) {
                    if (e.target.dataset.slug) {
                        console.log(7777, e.target)
                        myContentModel.getBook(e.target.dataset.slug)
                    }
                })
            }
        }
    }

    /* ------ end controller ----- */

    return {
        init: function (root, routes, components) {
            this.renderComponents(root, components);

            const contentView = new ContentView();
            const navBarView = new NavBarView();
            const contentModel = new ContentModel();
            const navBarModel = new NavBarModel();
            const controller = new ModuleController();

            //связываем части модуля
            contentView.init(document.getElementById(root), routes);
            navBarView.init(filters);
            contentModel.init(contentView);
            navBarModel.init(navBarView);
            controller.init(document.getElementById(root), contentModel, navBarModel);
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
