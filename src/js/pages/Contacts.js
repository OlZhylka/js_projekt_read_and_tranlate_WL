const Contacts = {
  id: "contacts",
  title: "Ну и страница Контакты, как без нее?",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
        <h1>Контакты</h1>
        <p>Ну а тут классически будет страница <strong>Контакты</strong>.</p>
      </section>
    `;
  }
};

export default Contacts;
