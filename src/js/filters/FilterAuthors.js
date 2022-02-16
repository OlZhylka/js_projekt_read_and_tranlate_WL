const FilterAuthors = {

    insert: (data,newAuthors)=>{
        let resultAuthors;
        console.log(252525,data,newAuthors);
        resultAuthors += `<option value="default" selected>Выберите автора</option>`
        for (let i = 0; i < data.length; i++) {
            resultAuthors += `
             <option value="${data[i]}"> ${data[i]}</option>
            `
        }
        newAuthors.innerHTML=resultAuthors;
    },

    render: (data) => {
        let resultAuthors;
        data = data.authors;
        resultAuthors += `<option value="default" selected>Выберите автора</option>`
              for (let i = 0; i < data.length; i++) {

            resultAuthors += `
             <option value="${data[i].name}"> ${data[i].name}</option>
            `
        }

        return `
       <h1><a href="/">Каталог</a></h1>
       <h3>Автор</h3>
       <select id="authors" name="select__author">
       
            ${resultAuthors},
       </select>
      `;
    }
}

export default FilterAuthors;
