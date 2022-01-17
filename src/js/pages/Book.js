const BookPage = {
    id: "book",
    title: "книга???",
    insert: (data, bookDetails) => {
        console.log('BookPage', data);
        let h2 = document.createElement('h2');
        h2.textContent = data.title;
        bookDetails.append(h2);
        // здесь вся верстка длястраницы унижки(общий контейнер bookDetails)
    },
    render: (className = "container", ...rest) => {
        return `
      <section class = "${className}">
         <div class="book__details" id="bookDetails"></div>
      </section>`;

    }
}

export default BookPage;
