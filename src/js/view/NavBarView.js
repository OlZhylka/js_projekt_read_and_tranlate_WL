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


export default NavBarView;