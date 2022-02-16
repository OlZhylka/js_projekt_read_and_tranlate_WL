function ModuleController() {
    let self = this;
    let myModuleContainer = null;
    let myContentModel = null;
    let myNawBarModel = null;
    let myHeaderModel = null;
    let myModalModel = null;

    this.init = function (root, modelContent, modelNavBar, modelHeader, modelModal) {

        const buttonFind = document.querySelector("button.button__find");
        const  selectAuthors= document.getElementById("authors");
        const  selectGenres= document.getElementById("genres");
        const buttonSignIn = document.getElementById("signIn");
        const buttonSignOut = document.getElementById("signOut");
        const modalSingIn = document.getElementById("modal_singIn");
        const closeSingIn = modalSingIn.querySelector(".close");
        const buttonSubmit = modalSingIn.querySelector("#submit");
        const buttonRegistration = modalSingIn.querySelector("#registration");
        const buttonAddWord = document.getElementById("addWord");
        const modalSingUp = document.getElementById("modal_singUp");
        const accordion = document.getElementById("accordion");
        const closeSingUp = modalSingUp.querySelector(".close");
        const buttonOK = modalSingUp.querySelector("#OK");


        myModuleContainer = root;
        myContentModel = modelContent;
        myNawBarModel = modelNavBar;
        myHeaderModel = modelHeader;
        myModalModel = modelModal;

        selectAuthors.addEventListener("change", getGenresForTheAuthor);
        selectGenres.addEventListener("change",getAuthorsForTheGenres);
        buttonFind.addEventListener("click", getListOfBooks);
        buttonSignIn.addEventListener("click", openModalSignIn);
        closeSingIn.addEventListener("click", closeModalSignIn);
        buttonRegistration.addEventListener("click", goToRegistration)
        buttonSignOut.addEventListener("click", outFromAccount);
        buttonSubmit.addEventListener("click", submitSingIn);
        buttonAddWord.addEventListener("click", addWord);
        closeSingUp.addEventListener("click", closeModalSignUp);
        buttonOK.addEventListener("click", registrateUser);
        accordion.addEventListener("click", showHideMenu);


        function addWord() {
            let word = document.querySelector("input[name=word]").value;
            let translate = document.querySelector("input[name=translate]").value;
            myNawBarModel.addWordToBase(word, translate);
            document.querySelector("input[name=word]").value = '';
            document.querySelector("input[name=translate]").value = '';
        }
        function getGenresForTheAuthor() {
            let authorSingle = document.getElementById("authors").value;
            myNawBarModel.getGenresForTheAuthor(authorSingle);
        }
        function getAuthorsForTheGenres() {
            let genreSingle = document.getElementById("genres").value;
            myNawBarModel.getAuthorsForTheGenre(genreSingle);
        }
        function getListOfBooks() {
            let authorSingle = document.getElementById("authors").value;
            let genreSingle = document.getElementById("genres").value;
            let epikaCheck = document.getElementById("epika").checked;
            let lirykaCheck = document.getElementById("liryka").checked;
            let dramatCheck = document.getElementById("dramat").checked;
            let kinds = {
                epika: epikaCheck,
                liryka: lirykaCheck,
                dramat: dramatCheck,
            }
            myNawBarModel.findBooksOfAuthor(authorSingle, genreSingle, kinds);
            self.updateState();
            showHideMenu();
        }

        function openModalSignIn() {
            myModalModel.openModalSignIn();
        }

        function closeModalSignIn() {
            myModalModel.closeModal(modalSingIn);
        }

        function closeModalSignUp() {
            myModalModel.closeModal(modalSingUp);
        }

        async function submitSingIn() {
            let email = document.getElementById("userEmail").value;
            let password = document.getElementById("userPass").value;
            if (email && password) {
                await myHeaderModel.login(email, password);
            }
            myNawBarModel.changeDisabledForButtonAddWord()
            myContentModel.showHideForAddingBook();
            closeModalSignIn();
        }

        function goToRegistration() {
            myModalModel.goToRegistration();
        }

        async function outFromAccount() {
            await myHeaderModel.outFromAccount();
            myNawBarModel.changeDisabledForButtonAddWord();
        }

        function registrateUser() {
            let email = document.getElementById("newEmail").value;
            let password = document.getElementById("newPass").value;
            let userName = document.getElementById("newUserName").value;
            myModalModel.registrateUser(email, password, userName, modalSingUp);
        }

        function showHideMenu() {
            myNawBarModel.showHideMobileMenu()
        }

        // вешаем слушателей на событие hashchange и кликам по пунктам меню
        window.addEventListener("hashchange", this.updateState);

        this.updateState(); //первая отрисовка
    }

    this.updateState = async function (offset) {

        myHeaderModel.toggleButtonHeader();

        // записываем значение после # из url
        const hashPageName = location.hash.slice(1).toLowerCase();

        // перерисовываем страницу по значению hashPageName
        await myContentModel.updateState(hashPageName, offset);

        // проверяем состояние кнопок в зависимости от того,
        // зарегистрирован ли пользователь
        myNawBarModel.changeDisabledForButtonAddWord();

        // удаляем слушатель scroll на всех страницах
        document.removeEventListener("scroll", addBooksToView);

        function addBooksToView() {
            let end = document.getElementById('end')

            if (document.getElementById("spa").getBoundingClientRect().bottom <= window.innerHeight && !end) {
                myContentModel.insertContent();
            }
        }

        // слушатели для страниц
        switch (hashPageName) {
            case "main":
            case "":

                const catalogSection = document.getElementById("catalogSection");
                document.addEventListener("scroll", addBooksToView);
                catalogSection.addEventListener("click", function (e) {
                    if (e.target.dataset.slug) {
                        myContentModel.setSlug(e.target.dataset.slug);
                        self.updateState();
                    }
                })
                break;
            case "book":
                const anotherBooks = document.getElementById("another_books");
                anotherBooks.addEventListener("click", function (e) {
                    if (e.target.dataset.slug) {
                        myContentModel.setSlug(e.target.dataset.slug);
                        self.updateState();
                    }
                })
                //кнопка "назад"
                const prevAudio = document.getElementById("prevAudio");
                if (prevAudio) {
                    prevAudio.addEventListener("click", function () {
                        myContentModel.setChapter(0);
                        myContentModel.setPlayer()
                    })
                }
                //кнопка "вперёд"
                const nextAudio = document.getElementById("nextAudio");
                if (nextAudio) {
                    nextAudio.addEventListener("click", function () {
                        myContentModel.setChapter(1);
                        myContentModel.setPlayer();
                    })
                }
                let buttonAddToMe = document.getElementById("addingBook");
                let buttonAdd = buttonAddToMe.querySelector("svg");
                const buttonRead = document.getElementById("buttonRead");

                buttonRead.addEventListener("click", readOnLine);

            function readOnLine(e) {
                if (e.target.dataset.slug) {
                    myContentModel.setSlug(e.target.dataset.slug);
                    self.updateState();
                }
            }

                buttonAdd.addEventListener("click", soundAndFillClick);

                // Добавлен звук и цвет по клику
            function soundAndFillClick() {
                let shortSound = new Audio(); // Создаём новый элемент Audio
                shortSound.src = 'sound/add.mp3'; // Указываем путь к звуку "клика"
                shortSound.autoplay = true; // Автоматически запускаем
                buttonAddToMe.querySelector("path").style.fill = "#31bf4e";
                myContentModel.setUserBook()
            }

                break;
            case "account":
                let account = document.getElementById("account");
                account.addEventListener("click", doSomethingInAccount);

            async function doSomethingInAccount(e) {
//переход поклику на страницу книги в списке
                if (e.target.dataset.slug) {
                    myContentModel.setSlug(e.target.dataset.slug);
                    self.updateState();
                }
                //удаление позиции в списке
                if (e.target.classList.contains('delete')) {
                    let parentLi = e.target.parentNode;
                    let slug = parentLi.querySelector(".titleInList").dataset.slug
                    myContentModel.deleteBookFromList(parentLi, slug);
                }
//добавление катрочки cо словом из селекта на стол
                if (e.target.id == "wordToCard") {
                    // Добавлен звук
                    let addCardSound = new Audio(); // Создаём новый элемент Audio
                    addCardSound.src = 'sound/addCard.mp3'; // Указываем путь к звуку "клика"
                    addCardSound.autoplay = true; // Автоматически запускаем
                    let wordID = account.querySelector("#vocabulary").value;
                    await myContentModel.addCardToWorkZone(wordID);
                    let newCardLearn = document.querySelector(`[data-word-id=${wordID}]`)
                    newCardLearn.addEventListener("mouseup", function () {
                        const finishFolder = document.getElementById('finishBox')
                        myContentModel.addCardToFinishFolder(wordID, newCardLearn, finishFolder)
                    })
                }
                // удаление карточки со стола
                if (e.target.classList.contains('deleteCard')) {
                    let crossForDeleteCard = e.target;
                    let vocabularySelect = account.querySelector("#vocabulary");
                    myContentModel.restoreOption(crossForDeleteCard, vocabularySelect);
                }
            }

                break;
            case "listofwords":
                const listOfLearnedWords = document.getElementById("listOfLearnedWords");
                listOfLearnedWords.addEventListener("click", backOrDeleteWord);

            function backOrDeleteWord(e) {
                if (e.target.classList.contains('backToSelect')) {
                    let liWord = e.target.parentNode;
                    let wordID = liWord.dataset.id;
                    myContentModel.backWordToSelect(wordID, liWord);
                }
                if (e.target.classList.contains('deleteWord')) {
                    let liWord = e.target.parentNode;
                    let wordID = liWord.dataset.id;
                    myContentModel.deleteWordFromVocabulary(wordID, liWord);
                }
            }

                break;
            default:
        }
    }
}

export default ModuleController;