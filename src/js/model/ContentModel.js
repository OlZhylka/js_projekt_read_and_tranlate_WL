import {getDatabase, ref, set} from "firebase/database";

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
export default ContentModel;