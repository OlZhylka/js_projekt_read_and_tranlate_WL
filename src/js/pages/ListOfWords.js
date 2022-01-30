const ListOfWords = {
    id: "list",
    title: "Список выученных слов",
    insert: (data, listOfWords) => {
        const titleListOfWords=document.createElement('h2');
        titleListOfWords.textContent = "Список выученных слов"
        let list = document.createElement('ol');
        list.id="listOfLearnedWords"
        for (let i in data) {
            list.innerHTML += `<li data-id="${data[i].id}">
            ${data[i].word} - ${data[i].translate}&nbsp;
            <a href="javascript:void(0);" title="Вернуть в мой словарик" class="backToSelect">
                        </a>&nbsp;&nbsp;
            <a href="javascript:void(0);" title="Удалить слово" class="deleteWord">
            </a>
            </li>`;
        }
        listOfWords.prepend(titleListOfWords);
        listOfWords.append(list);
        titleListOfWords.classList.add("titleListOfWords")
    },
    render: (className = "container", ...rest) => {
        return `
      <section class = "${className}">
         <div class="listOfWords" id="listOfWords"></div>
      </section>`;

    }
}

export default ListOfWords;