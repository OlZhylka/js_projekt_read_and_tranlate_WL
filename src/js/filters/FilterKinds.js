const FilterKinds = {
    render: () => {
        return `
            <h3>Род литературы</h3>
            
            <div>
 <div> <input type="checkbox" id="epika" name="epika">
  <label for="epika">Эпос</label></div>
   <div><input type="checkbox" id="liryka" name="liryka">
  <label for="liryka">Лирика</label></div>
  <div> <input type="checkbox" id="dramat" name="dramat">
  <label for="dramat">Драма</label></div>
</div>
           `;
    }
}

export default FilterKinds;