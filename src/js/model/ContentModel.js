import {getDatabase, ref, set, remove, get, child} from "firebase/database";

function ContentModel() {
    let self = this;
    let myContentView = null;
    const db = getDatabase();
    let clickLink = null;
    let offset = 0; //положение, с которого начинать читать массив
    let chapter = 0;
    this.init = function (view) {
        myContentView = view;
    }

    this.getUserID = function () {
        let user = self.getStorage('local', 'user');
        let id = 'id_' + user.email.replace('.', '_');
        return id;
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
    let slug = self.getStorage('local', 'slug');
    reduce = self.getStorage('session', 'books');

    this.updateState = async function (_pageName) {
        let data = null;
        offset = 0; //положение, с которого начинать читать массив
// _pageName -- это хвост от url страницы
        myContentView.renderContent(_pageName);

        switch (_pageName) {
            case 'main':
            case '':
                data = await self.getBooks();
                myContentView.insertContent(data);
                break;
            case 'book':
                await self.getBook();
                self.showHideForAddingBook();
                break;
            case 'account':
                self.workAccount()
                break;
            case 'read':
                myContentView.insertRead(slug)
                break;
            case "listofwords":
                await self.insertListOfWords(slug)
                break;
            default:
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
        // начинаем читать следующие элементы
        return books;
    }

    this.setSlug = function (bookSlug) {
        self.setStorage('local', 'slug', bookSlug)
        slug = bookSlug;
        clickLink = true;
    }

    this.getBook = async function () {
        let singleBook = self.getStorage('local', 'singleBook');
        if (singleBook && !clickLink) {
            clickLink = null;
        } else {
            await fetch(`https://wolnelektury.pl/api/books/${slug}?format=json`)
                .then((response) => response.json())//считываем ответ по запросу и получаем data
                .then((data) => {
                    let media = []
                    for (let i in data.media) {
                        if (data.media[i].type == "mp3") {
                            media.push(data.media[i])
                        }
                    }
                    data.media = media;
                    data.slug = slug;
                    self.setStorage('local', 'singleBook', data);
                    singleBook = data;
                    // myContentView.insertBookDetails(data);
                }).catch((e) => {
                    console.error('Error:' + e)
                })
        }
        myContentView.insertBookDetails(singleBook);
        chapter = 0;
        self.setPlayer();
        self.getBooksOfAuthor(singleBook.authors[0].slug);
    }

    this.getBooksOfAuthor=function (slug){
              fetch(`https://wolnelektury.pl/api/authors/${slug}/books?format=json`)
            .then((response) => response.json())
            .then((data) => {
                // self.setStorage('local', 'singleBook', data);
                myContentView.insertBooksOfAuthor(data);
            }).catch((e) => {
            console.error('Error:' + e)
        })
    }

    this.workAccount = function () {
        let id = self.getUserID();
        let data = '';
        get(child(ref(db), id + '/')).then( (snapshot) => {
            data = snapshot.val();
            let words = [];
            for (let key in data.words){
                if(data.words[key].learned == 0) {
                    words.push(data.words[key])
                }
            }
            data.words = words;
            myContentView.insertAccount(data);
        })
    }

    this.setChapter = function (check) {
        if (check) {
            chapter++;
        } else {
            chapter--;
        }
        myContentView.changeNumberAudio(chapter + 1)
    }
    this.setPlayer = function () {
        let player = document.getElementById('player');
        if (player) {
            myContentView.changeNumberAudio(chapter + 1);
            let data = self.getStorage('local', 'singleBook');
            myContentView.insertPlayer(player, data.media[chapter]);
            let audioPlayer = player.querySelector("#audioPlayer");
            if (audioPlayer) {
                audioPlayer.addEventListener('ended', function () {
                    myContentView.insertPlayer(player, data.media[chapter], "play");
                });
            }
        }
    }

    this.setUserBook = function () {
        let book = self.getStorage('local', 'singleBook');
        let id = self.getUserID();
        let books = {
            title: book.title,
            cover_thumb: book.cover_thumb,
            author: book.authors[0].name
        };
        set(ref(db, id + '/books/' + book.slug + '/'), books);
    }

    this.deleteBookFromList = function (elem, slug) {
        let id = self.getUserID();
        remove(ref(db, id + '/books/' + slug + '/'));
        myContentView.removeElementOfList(elem);
    }

    this.addCardToWorkZone = async function (wordID) {
        if (wordID != "default") {
            let id = self.getUserID();
            myContentView.removeOptionInVocabularySelect(wordID);
                // не используем изменени базы в текущем времени (onView), т.к.
                // запускается перерисовка WorkZone
                await get(child(ref(db), id + '/words/' + wordID + '/')).then( (snapshot) => {
                let data = snapshot.val();
                data.id = wordID;
                myContentView.insertCardToWorkZone(data);
            })
        }
    }

    this.restoreOption = function (crossForDeleteCard, vocabularySelect) {
        myContentView.restoreOption(crossForDeleteCard, vocabularySelect)
    }

    this.addCardToFinishFolder = function (wordId, card, finishFolder) {


        let cardTop = card.offsetTop;
        let cardWidth = card.offsetWidth;
        let cardHeight = card.offsetHeight;
        let cardLeft = card.offsetLeft;
        let boxTop = finishFolder.offsetTop;
        let boxLeft = finishFolder.offsetLeft;
        let topHidden = boxTop - 0.5 * cardHeight;
        let leftHidden = boxLeft - 0.5 * cardWidth;

        if (cardTop >= topHidden && cardLeft >= leftHidden) {
            // Добавлен звук
            let wseGotowo = new Audio(); // Создаём новый элемент Audio
            wseGotowo.src = 'sound/wseGotowo.mp3'; // Указываем путь к звуку "клика"
            wseGotowo.autoplay = true; // Автоматически запускаем
            let id = self.getUserID();
            set(ref(db, `${id}/words/${wordId}/learned/`), 1);
            myContentView.deleteElement(card)
        }
    }

    this.insertListOfWords = async function (){
        let id = self.getUserID();
        let data = '';

        await get(child(ref(db), `${id}/words`)).then( (snapshot) => {
            data = snapshot.val();
            let words = [];
            for (let key in data){
                if(data[key].learned == 1) {
                    data[key].id = key;
                    words.push(data[key])
                }
            }
            myContentView.insertListOfWords(words);
        })
    }
    this.backWordToSelect= function (wordId,elem) {
        let id = self.getUserID();
        set(ref(db, `${id}/words/${wordId}/learned/`), 0);
        myContentView.deleteElement(elem);
    }

    this.deleteWordFromVocabulary= function (wordId,elem){
        let id = self.getUserID();
        remove(ref(db, `${id}/words/${wordId}/`));
        myContentView.deleteElement(elem);
    }
        //Прячу звездочку для неавторизованного пользователя
    this.showHideForAddingBook = function (){
        let user = self.getStorage('local', 'user');
        const addingBook = document.getElementById("addingBook");
        if (addingBook) {
            if (user) {
                addingBook.classList.remove('hide')
            } else {
                addingBook.classList.add('hide')
            }
        }
    }
}

export default ContentModel;