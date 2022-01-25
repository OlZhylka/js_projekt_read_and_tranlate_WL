const BookPage = {
    id: "book",
    title: "книга???",
    audio: (player, data, play) => {
        player.innerHTML = `<figcaption>${data.name}</figcaption>`;
        let audioPlayer = new Audio(data.url);
        audioPlayer.id = "audioPlayer";
        audioPlayer.controls = true;
        player.prepend(audioPlayer);
        player.classList.add("player")
        if (play) {
            audioPlayer.play()
        }
    },
    insert: (data, bookDetails) => {
        bookDetails.innerHTML = '';
        console.log('bookpage', data);
        let bookCover = document.createElement('div');
        let buttonRead = document.createElement('button');
        let bookBox = document.createElement("div");
        let buttonAddToMe = document.createElement("div");
        let bookAuthor = document.createElement('h3');
        let bookTitle = document.createElement('h2');
        let bookKind = document.createElement("div");
        let bookGenre = document.createElement("div");
        let description = document.createElement("div");
        let playerContainer = document.createElement("div");
        let player = document.createElement("div");
        let filesForDownload = document.createElement("div");
        let buttonsContainer = document.createElement('div');
        let otherBooks = document.createElement('div');

        bookDetails.append(bookCover);

        bookDetails.append(bookBox);
        bookCover.after(buttonAddToMe)
        bookBox.append(bookAuthor);
        bookBox.append(bookTitle);
        bookBox.append(bookKind);
        bookKind.after(bookGenre);
        bookBox.append(filesForDownload);
        bookDetails.after(otherBooks);

        function addOtherBooks() {

            let bookSection = document.createElement('div');
            let bookContent = document.createElement('div');
            bookSection.classList.add('book__section')
            bookSection.innerHTML = `<a href="#book" data-slug="${data.slug}">
<img class="book__cover" src = \'${data.cover_thumb}\'></a>`;
            bookSection.append(bookContent);
            bookContent.innerHTML = `<h4><a href="#book" data-slug="${data.slug}">${data.title}</a></h4>
                <h5>${data.author} </h5>
                <h6>${data.kind} </h6>`
            // if (data.has_audio) {
            bookContent.innerHTML += `<img title="есть аудиокнига" src=\'img/book_audio.png\'>`
            // }
            otherBooks.append(bookSection);
        }

        addOtherBooks();
        addOtherBooks();
        addOtherBooks();


        bookCover.innerHTML = `<img class="book__cover" src = \'${data.cover_thumb}\'>`;
        bookCover.append(buttonRead);
        buttonRead.innerHTML=`<a href='#read'>Читать</a>`;
        buttonRead.id="buttonRead";
        buttonRead.dataset.slug =data.slug;
        buttonAddToMe.innerHTML = `<svg width="40" height="42" viewBox="0 0 40 42" fill="none" 
xmlns="http://www.w3.org/2000/svg">
<path d="M19.9999 2.17681L25.7269 14.3796L25.8403 14.6211L26.1041 
14.6614L38.9626 16.6258L29.6421 26.1785L29.4659 26.3591L29.5065 
26.6082L31.7008 40.0643L20.2419 33.7296L20 33.5959L19.7581 33.7296L8.29846 
40.0643L10.4935 26.6082L10.5341 26.3591L10.3579 26.1785L1.03743 16.6258L13.8951 
14.6614L14.1588 14.6211L14.2722 14.3796L19.9999 2.17681Z" fill="#FFFFFF" stroke="#8FBF94"/>
</svg>
`;
        if (data.kinds[0].name) {
            bookKind.innerHTML = `<span> род литературы: </span><span>${data.kinds[0].name}</span>`;
            bookGenre.innerHTML = `<span>жанр литературы: </span><span>${data.genres[0].name}</span>`;
        }
        if (data.fragment_data) {
            description.innerHTML = `${data.fragment_data.html}`;
            filesForDownload.after(description);
        }
        if (data.media.length) {
            bookBox.after(playerContainer);
            playerContainer.append(player);
            player.setAttribute("id", "player")
            player.after(buttonsContainer);
            buttonsContainer.innerHTML = `<button class="button__rewind"><a id='prevAudio' href='javascript:void(0)'><<</a></button>
                <span>1</span>/<span>42</span>
                <button class="button__forward"><a id='nextAudio' href='javascript:void(0)'>>></a></button>`
        }
        if (data.epub) {
            filesForDownload.innerHTML += `<button class="_epub">
<a href="${data.epub}"> epub </a></button>`;
        }
        if (data.fb2) {
            filesForDownload.innerHTML += `<button class="_epub">
<a href="${data.fb2}"> fb2 </a></button>`;
        }
        if (data.pdf) {
            filesForDownload.innerHTML += `<button class="_epub">
<a href="${data.pdf}"> pdf </a></button>`;
        }
        if (data.txt) {
            filesForDownload.innerHTML += `<button class="_epub">
<a href="${data.txt}"> txt </a></button>`;
        }

        bookAuthor.textContent = data.authors[0].name;
        bookTitle.textContent = data.title;

        bookCover.classList.add("book_cover");
        buttonAddToMe.id = "addingBook";
        bookBox.classList.add("book_box");
        bookKind.classList.add("kind");
        bookGenre.classList.add("genre");
        description.classList.add("description");
        filesForDownload.classList.add("book_files");
        playerContainer.classList.add("player_container")
        buttonsContainer.classList.add("buttons_container")
        otherBooks.classList.add("other__books");

        // здесь вся верстка для страницы книжки(общий контейнер bookdetails)
    },
    render: (className = "container", ...rest) => {
        return `
      <section class = "${className}">
         <div class="book__details_raw" id="bookDetails"></div>
      </section>`;

    }
}

export default BookPage;
