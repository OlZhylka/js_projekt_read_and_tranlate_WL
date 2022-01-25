const FilterGenres = {
    render: (data) => {
        let resultGenres;
        data = data.genres
        console.log(111,data)
        resultGenres += `<option value="default" selected>Выберите жанр</option>`
        for (let i = 0; i < data.length; i++) {

            resultGenres += `
             <option value="${data[i].name}"> ${data[i].name}</option>
            `
        }

        return `
       <h3>Жанр:</h3>
       <select id="genres" name="select__genres">
            ${resultGenres},
       </select>
      `;
    }
}

export default FilterGenres;
