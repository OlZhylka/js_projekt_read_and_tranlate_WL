const VocabularyForm = {
    render: () => {

        return `
      
       <div class="forAddToVocabulary" xmlns="http://www.w3.org/1999/html">
      <h3> <a href"#account">Мой&nbsp;словарик</a></h3>
       <div id="myWord">Слово</div><input name="word">
       <div id="myTranslate">Перевод</div><input name="translate">
       <button id="addWord" class="button__addWord">Добавить</button>
</div>
      
    
      `;
    }
}

export default VocabularyForm;