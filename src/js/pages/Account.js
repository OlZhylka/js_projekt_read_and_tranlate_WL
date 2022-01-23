const AccountPage = {
    id: "book",
    title: "книга???",
    insert: (data, bookDetails) => {
        console.log('account', 5555555);
        insert: (data, bookDetails) => {
            bookDetails.innerHTML = '';
            // console.log('bookpage', data);
            let listTitle = document.createElement('h3');
            let listOfBooks =document.createElement('ul');
            let bookContent = document.createElement('li');
             listOfBooks.append(bookContent);
            bookContent.innerHTML = `
                <h4><a href="#book" data-slug="${data[i].slug}">${data[i].title}</a></h4>
                <span>${data[i].author} </span>`;
               listOfBooks.append(bookContent);

            let vecabularyTitle = document.createElement('h3');
            listOfBooks.after(vecabularyTitle);
            let vecabulary = document.createElement('select');
            vecabularyTitle.after(vecabulary);
            let buttonWord = document.createElement('button');
            let buttonWordsAuto = document.createElement('button');
            vecabulary.after(buttonWord);
            buttonWord.after(buttonWordsAuto);
            let workZone = document.createElement('div');
            buttonWordsAuto.after(workZone);

            buttonWordsAuto.addEventListener("click", function (){
                let card = document.createElement('div');
                workZone.append(card);
                card.classList.add("card")
                card.innerHTML=`<div>WORD1</div><div class="translation">перевод</div>`;

// Levf. 6 штук
                card.addEventListener("click", function (){
                   let playCard=card.querySelector("class","translation");
                   playCard.classList.toggle("hidden");
                })
                let buttonFinish = document.createElement('button');
                workZone.after(buttonFinish);
                buttonFinish.addEventListener("click", function (){

                })

            })











        }
        // здесь вся верстка для страницы унижки(общий контейнер bookdetails)
    },
    render: (className = "container", ...rest) => {
        return `
      <section class = "${className}">
         <div class="account" id="account"></div>
      </section>`;

    }
}

export default AccountPage;