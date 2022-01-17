const FilterAuthors = {
    render: (data) => {
        let resultAuthors;
        console.log(888,data)
        resultAuthors += `<option value="Выберите автора" selected>Выберите автора</option>`
              for (let i = 0; i < data.length; i++) {

            resultAuthors += `
             <option value="${data[i].name}"> ${data[i].name}</option>
            `
        }

        return `
       <h3>Автор</h3>
       <select id="authors" name="select__author"> <!--Supplement an id here instead of using 'name'-->
            ${resultAuthors},
       </select>
     
      
      `;
    }
}

export default FilterAuthors;
