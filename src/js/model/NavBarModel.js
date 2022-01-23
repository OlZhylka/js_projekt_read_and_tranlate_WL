function NavBarModel() {
    let self = this;
    let reduce2 = sessionStorage.getItem('authors')
    let myNavBarView = null;
    this.init = function (view) {
        myNavBarView = view;
        self.getAuthors();
    }

    this.getAuthors = async function () {
        let authors = null;
        if (reduce2) {
            console.log("aUUU", JSON.parse(reduce2));
            authors = JSON.parse(reduce2);
        } else {
            await fetch('https://wolnelektury.pl/api/authors/?format=json')
                .then((response) => response.json())
                .then((data) => {
                    sessionStorage.setItem('authors', JSON.stringify(data));
                    console.log("auth", data);
                    authors = data;
                })
        }

        myNavBarView.renderFilter(authors);
        // return authors;   // Этот массив нам надо передать в селект. и чтобы он уже там был
        // при первой загрузке,поэтому вызываем его в контроллере
    }
    this.findBooksOfAuthor = function (_author) {
        let books = sessionStorage.getItem('books');
        books = JSON.parse(books);
        console.log(21, books);
        let booksOfAuthor = [];
        for (let key in books) {
            if (_author == books[key].author) {
                booksOfAuthor.push(books[key]);
            }
        }
        reduce = JSON.stringify(booksOfAuthor);
        console.log(54, booksOfAuthor);
    }

}
export default NavBarModel;
