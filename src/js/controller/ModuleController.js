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
export default ModuleController;