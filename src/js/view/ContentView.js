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

    this.insertRead = function (data) {
        const read = document.getElementById("readDetails");
        routes['read'].insert(data, read);
    }
    this.removeElementOfList = function (elem) {
        elem.remove();
    }

}
export default ContentView;