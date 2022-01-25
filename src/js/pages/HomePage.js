const HomePage = {
    id: "main",
    title: "Главная страница примера SPA",
    insert: (data, catalogSection) => {
        console.log(555666, data);
        for (let i = 0; i < data.length; i++) {
            if (data[i] != 'end') {
                let bookSection = document.createElement('div');
                let bookContent = document.createElement('div');
                bookSection.classList.add('book__section')
                bookSection.innerHTML = `<a href="#book" data-slug="${data[i].slug}"><img class="cover" 
              src = \'https://wolnelektury.pl/media/${data[i].cover_thumb}\'></a>`
                bookSection.append(bookContent);
                bookContent.innerHTML = `
                <h4><a href="#book" data-slug="${data[i].slug}">${data[i].title}</a></h4>
                <h5>${data[i].author} </h5>
                <h6>${data[i].kind} </h6>
                <h6>${data[i].genre} </h6>`
                if (data[i].has_audio) {
                    bookContent.innerHTML += `<img title="есть аудиокнига" src=\'img/book_audio.png\'>`
                }
                catalogSection.append(bookSection);
            } else {
                let end = document.createElement('div');
                end.setAttribute('id', 'end');
                end.classList.add('book__section');
                catalogSection.append(end);
            }
        }
    },
    render: (className = "container", ...rest) => {
        return `
      <section class = "${className}">
                <h1 class="title_library">Библиотека</h1>
         <div class="catalog__section" id="catalogSection">
        </div>
               
      </section>`;

    }
}

export default HomePage;
