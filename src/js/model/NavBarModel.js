import {getDatabase, ref, set} from "firebase/database";

function NavBarModel() {
    let self = this;
    let myNavBarView = null;
    const db = getDatabase();
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
                    console.log("auth", data);
                    authors = data;
                })
        }

        let genres = self.getStorage("session", "genres");

        if (!genres) {
            await fetch('https://wolnelektury.pl/api/genres/?format=json')
                .then((response) => response.json())
                .then((data) => {
                    self.setStorage("session", "genres", data)
                    console.log("genres", data);
                    genres = data;
                })
        }

        let data = {
            authors: authors,
            genres: genres,
        }

        console.log(989898989, data);

        myNavBarView.renderFilter(data);
        // return authors;   // Этот массив нам надо передать в селект. и чтобы он уже там был
        // при первой загрузке,поэтому вызываем его в контроллере
    }

    this.findBooksOfAuthor = function (_author, _genre, _kinds) {
        let books = self.getStorage("session", "books");
        console.log(21, _author, _genre, _kinds);

        let booksAfterFilterChoose = [];
        if (_author != "default") {
            for (let key in books) {
                if (_author == books[key].author) {
                    booksAfterFilterChoose.push(books[key]);
                }
            }
            books = booksAfterFilterChoose;
        }
        if (_genre != "default") {
            booksAfterFilterChoose = []; //чтобы не дублировались значения при получении второй выборки
            for (let key in books) {
                if (_genre == books[key].genre) {
                    booksAfterFilterChoose.push(books[key]);
                }
            }
            books = booksAfterFilterChoose;
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
        reduce = books;
    }

    this.addWordToBase = function (word, translate) {
        let user = self.getStorage('local', 'user');
        let id = 'id_' + user.email.replace('.', '_');
        let wordTranslate = {
            word: word.toLowerCase(),
            translate: translate.toLowerCase()
        }
        set(ref(db, id + '/words/id_' + word.toLowerCase() + '/'), wordTranslate);
    }

}

export default NavBarModel;
