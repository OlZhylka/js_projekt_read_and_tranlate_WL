const BookPage = {
    id: "book",
    title: "книга???",
    insertBooksOfAuthor: (data, anotherBooks) => {
    let audioIcon = '';
        for(let i =0; i<3; i++) {
            let y = Math.floor( Math.random()*data.length);
            if (data[y].has_audio) {
                audioIcon = `<img title="есть аудиокнига" src=\'img/book_audio.png\'>`
            }
            anotherBooks.innerHTML += `<div class="book__section"><a href="#book" data-slug="${data[y].slug}">
                <img class="cover" src = "https://wolnelektury.pl/media/${data[y].cover_thumb}"></a>
                    <div class="bookBox">
                        <h4><a href="#book" data-slug="${data[y].slug}">${data[y].title}</a></h4>
                        <h5>${data[y].author} </h5>
                        <h5>${data[y].kind} </h5>
                        ${audioIcon}
                    </div>
                </div>`;
        }
    },
    audio: (player, data, play) => {
        player.innerHTML = `<figcaption>${data.name}</figcaption>`;
        let audioPlayer = new Audio(data.url);
        audioPlayer.id = "audioPlayer";
        audioPlayer.controls = true;
        player.prepend(audioPlayer);
        player.classList.add("player");
        if (play) {
            audioPlayer.play();
        }
    },
    insert: (data, bookDetails) => {
        bookDetails.innerHTML = '';
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
        let anotherTitle = document.createElement('h4');
        let anotherBooks = document.createElement('div');

        bookDetails.append(bookCover);
        bookDetails.append(bookBox);
        bookCover.after(buttonAddToMe)
        bookBox.append(bookAuthor);
        bookBox.append(bookTitle);
        bookBox.append(bookKind);
        bookKind.after(bookGenre);
        bookBox.append(filesForDownload);
        bookDetails.after(anotherTitle);
        anotherTitle.after(anotherBooks);

        bookCover.innerHTML = `<img  src = \'${data.cover_thumb}\'>`;
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
            </svg> `;
        if (data.kinds[0].name) {
            bookKind.innerHTML = `<span> род литературы: </span><span>${data.kinds[0].name}</span>`;
            bookGenre.innerHTML = `<span>жанр литературы: </span><span>${data.genres[0].name}</span>`;
        }
        if (data.fragment_data) {
            description.innerHTML = `${data.fragment_data.html}`;
            filesForDownload.after(description);
        }
        if (data.media.length) {
            bookBox.append(playerContainer);
            playerContainer.append(player);
            player.setAttribute("id", "player")
            player.after(buttonsContainer);
            buttonsContainer.innerHTML = `<button id='prevAudio' class="button__rewind"><<</button>
                <span id="numberAudio"></span>/<span id="countAudio">${data.media.length}</span>
                <button id='nextAudio' class="button__forward">>></button>`
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

        //Добавляем книжки автора
        bookAuthor.textContent = data.authors[0].name;
        bookTitle.textContent = data.title;
        anotherTitle.textContent = "Другие книги автора";

        bookCover.classList.add("book_cover");
        buttonRead.classList.add("button__readOnline");
        buttonAddToMe.id = "addingBook";
        bookBox.classList.add("book_box");
        bookKind.classList.add("kind");
        bookGenre.classList.add("genre");
        description.classList.add("description");
        filesForDownload.classList.add("book_files");
        playerContainer.classList.add("player_container")
        buttonsContainer.classList.add("buttons_container")
        anotherBooks.classList.add("another_books");
        anotherBooks.id ="another_books";
        anotherTitle.classList.add("another_title");
    },
    render: (className = "container", ...rest) => {
        return `
      <section class = "${className}">
         <div class="book__details_raw" id="bookDetails">
            <div class="preloader" id="preloader">
              <span></span>
              <span></span>
              <span></span>
            </div>
        </div>
        <div id="end"></div>
      </section>`;

    }
}

export default BookPage;
