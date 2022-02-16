const FilterGenres = {
    insert: (data,newGenres)=>{
        let resultGenres;
        console.log(252525,data,newGenres);
        resultGenres += `<option value="default" selected>Выберите жанр</option>`
        for (let i = 0; i < data.length; i++) {
            resultGenres += `
             <option value="${data[i]}"> ${data[i]}</option>
            `
        }
        newGenres.innerHTML=resultGenres;
},
    render: (data) => {
        let resultGenres;
        data = data.genres
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
