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

    this.renderContent = function (_hashPageName) {
        let routeName = "default";

        if (_hashPageName.length > 0) {
            routeName = _hashPageName in routes ? _hashPageName : "error";
        }


        window.document.title = routes[routeName].title;
        contentContainer.innerHTML = routes[routeName].render(`${routeName}-page`);

    }

    this.insertContent = function (data) {
        const preloader = document.getElementById("preloader");
        const catalogSection = document.getElementById("catalogSection");
        preloader.classList.add('hide');
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

    this.insertRead = function (data) {
        const read = document.getElementById("readDetails");
        routes['read'].insert(data, read);
    }
    this.removeElementOfList = function (elem) {
        elem.remove();
    }
    this.insertCardToWorkZone = function (data) {
        let workZone=document.getElementById("workZone")
        routes['account'].insertCards(data,workZone);
    }
    this.changeNumberAudio = function (number){
        const numberAudio = document.getElementById("numberAudio");
        const prevAudio = document.getElementById("prevAudio");
        const countAudio = document.getElementById("countAudio");
        const nextAudio = document.getElementById("nextAudio");
        if(number == 1){
            prevAudio.setAttribute('disabled', '')
        } else if (prevAudio.hasAttribute('disabled')) {
            prevAudio.removeAttribute('disabled')
        }
        if(countAudio.textContent == number){
            nextAudio.setAttribute('disabled', '')
        } else if (nextAudio.hasAttribute('disabled')) {
            nextAudio.removeAttribute('disabled')
        }
        numberAudio.innerText = number;
    }

    this.removeOptionInVocabularySelect = function (wordId){
        const vocabularySelect = document.getElementById("vocabulary");
        let option = vocabularySelect.querySelector(`[value=${wordId}]`);
        option.remove();

    }

    this.restoreOption = function (crossForDeleteCard, vocabularySelect){
        let option = document.createElement('option');
        let wordId = crossForDeleteCard.parentNode.dataset.wordId
        let word = crossForDeleteCard.parentNode.querySelector('#word').textContent;
        let translation = crossForDeleteCard.parentNode.querySelector('#translation').textContent
        option.innerText = `${word} - ${translation}`;
        option.value = wordId
        vocabularySelect.append(option);
        crossForDeleteCard.parentNode.remove();
    }

    this.deleteElement = function (elem){
        elem.remove();
    }

    this.insertListOfWords = function (data){
        const listOfWords = document.getElementById("listOfWords");
        routes['listofwords'].insert(data, listOfWords);
    }

    this.insertBooksOfAuthor = function (data){
        const anotherBooks = document.getElementById('another_books');
        routes['book'].insertBooksOfAuthor(data, anotherBooks);
    }
}
export default ContentView;