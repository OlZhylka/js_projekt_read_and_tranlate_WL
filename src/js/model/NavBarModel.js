import {getDatabase, ref, set} from "firebase/database";

function NavBarModel() {
    let self = this;
    let myNavBarView = null;
    const db = getDatabase();
    const getNewArrayOfBooks = function (_author, _genre = "default", _kinds = "default") {
        let books = self.getStorage("session", "books");
        let booksAfterFilterChoose = [];

        if (_author != "default") {
            for (let key in books) {
                if (_author == books[key].author) {
                    booksAfterFilterChoose.push(books[key]);
                }
            }
            console.log(191919, booksAfterFilterChoose);
            books = booksAfterFilterChoose;
        } else {
            console.log(777)
            flagOfChangeInSelectGenres=1;
        }
        if (_genre != "default") {
            booksAfterFilterChoose = []; //чтобы не дублировались значения при получении второй выборки
            for (let key in books) {
                if (_genre == books[key].genre) {
                    booksAfterFilterChoose.push(books[key]);
                }
            }
            books = booksAfterFilterChoose;
        }  else {
            flagOfChangeInSelectAuthors=1;
        }
        if (_kinds.epika) {
            booksAfterFilterChoose = [];

            for (let key in books) {
                if (books[key].kind == "Epika") {
                    booksAfterFilterChoose.push(books[key]);
                }
            }
            books = booksAfterFilterChoose;
        }
        if (_kinds.liryka) {
            booksAfterFilterChoose = [];

            for (let key in books) {
                if (books[key].kind == "Liryka") {
                    booksAfterFilterChoose.push(books[key]);
                }
            }
            books = booksAfterFilterChoose;
        }
        if (_kinds.dramat) {
            booksAfterFilterChoose = [];

            for (let key in books) {
                if (books[key].kind == "Dramat") {
                    booksAfterFilterChoose.push(books[key]);
                }
            }
            books = booksAfterFilterChoose;
        }
        return books;

    }
    this.init = async function (view) {
        myNavBarView = view;
        await self.getDataFilters();
    }
    this.getStorage = function (storage, key) {
        if (storage == 'local') {
            return JSON.parse(localStorage.getItem(key))
        } else if (storage == 'session') {
            return JSON.parse(sessionStorage.getItem(key))
        }
    }
    this.setStorage = function (storage, key, value) {
        if (storage == 'local') {
            localStorage.setItem(key, JSON.stringify(value));
        } else if (storage == 'session') {
            sessionStorage.setItem(key, JSON.stringify(value));
        }
    }

    this.getDataFilters = async function () {
        let authors = self.getStorage("session", "authors");
        if (!authors) {
            await fetch('https://wolnelektury.pl/api/authors/?format=json')
                .then((response) => response.json())
                .then((data) => {
                    self.setStorage("session", 'authors', data);
                    authors = data;
                })
        }

        let genres = self.getStorage("session", "genres");


        if (!genres) {
            await fetch('https://wolnelektury.pl/api/genres/?format=json')
                .then((response) => response.json())
                .then((data) => {
                    self.setStorage("session", "genres", data)
                    genres = data;
                })
        }

        let data = {
            authors: authors,
            genres: genres,
        }

        myNavBarView.renderFilter(data);
        // Этот массив нам надо передать в селект. и чтобы он уже там был
        // при первой загрузке,поэтому вызываем его в контроллере
    }
let flagOfChangeInSelectAuthors=1;
let flagOfChangeInSelectGenres=1;

    this.getGenresForTheAuthor = function (_author) {
        if(flagOfChangeInSelectAuthors) {
            let genresInBooksOfAuthor = [];
            flagOfChangeInSelectGenres=0;
            let books = getNewArrayOfBooks(_author);

            for (let i in books) {
                genresInBooksOfAuthor.push(books[i].genre);
            }
            // убираю повторяющиеся значения
            genresInBooksOfAuthor = [...new Set(genresInBooksOfAuthor)];
            genresInBooksOfAuthor.sort();
            let data = genresInBooksOfAuthor;
            myNavBarView.changeSelectGenres(data);

        }
    }
    this.getAuthorsForTheGenre =function (_genre) {
        if(flagOfChangeInSelectGenres) {
            let authorsInBooksOfGenre = [];
            flagOfChangeInSelectAuthors = 0;
            let books = getNewArrayOfBooks("default", _genre);
            console.log(666, _genre, books)
            for (let i in books) {
                authorsInBooksOfGenre.push(books[i].author);
            }
            // убираю повторяющиеся значения
            authorsInBooksOfGenre = [...new Set(authorsInBooksOfGenre)];
            authorsInBooksOfGenre.sort();
            let data = authorsInBooksOfGenre;

            myNavBarView.changeSelectAuthors(data);

        }

    }


    this.findBooksOfAuthor = function (_author, _genre, _kinds) {
        reduce = getNewArrayOfBooks(_author, _genre, _kinds);
    }

    this.addWordToBase = function (word, translate) {
        let user = self.getStorage('local', 'user');
        let id = 'id_' + user.email.replace('.', '_');
        let wordTranslate = {
            word: word.toLowerCase(),
            translate: translate.toLowerCase(),
            learned: 0
        }
        set(ref(db, id + '/words/id_' + word.toLowerCase() + '/'), wordTranslate);
    }

    this.showHideMobileMenu = function () {
        myNavBarView.showHideMobileMenu()
    }

    this.changeDisabledForButtonAddWord = function () {
        let user = self.getStorage('local', 'user');
        const buttonAddWord = document.getElementById("addWord");
        if (user) {
            buttonAddWord.removeAttribute('disabled')
        } else {
            buttonAddWord.setAttribute('disabled', '')
        }
    }

}

export default NavBarModel;
