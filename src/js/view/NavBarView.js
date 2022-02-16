function NavBarView() {
    let filters = null;
    let navBar = null;


    this.init = function (_filters) {
        navBar = document.getElementById("navBar");
        filters = _filters;
    }

    this.renderFilter = function (data) {
        for (let item in filters) {
            navBar.innerHTML += filters[item].render(data);
        }
    }
    this.showHideMobileMenu = function () {
        const navbar = document.querySelector('nav');
        navbar.classList.toggle('show');
    }
    this.changeSelectGenres = function (data) {
        const selectGenres = document.getElementById("genres");
        filters.genres.insert(data, selectGenres);
    }
    this.changeSelectAuthors = function (data) {
        const selectAuthors = document.getElementById("authors");
        filters.authors.insert(data, selectAuthors);
    }
}

export default NavBarView;