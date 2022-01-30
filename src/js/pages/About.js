const About = {
  id: "about",
  title: "Какой-то описательный текст данного SPA",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
        <h1>О проекте</h1>
        <p>Проект разработан как библиотека для чтения литературы на иностранном язы <strong>О ghjtrnt</strong> или о них =)</p>
      </section>
    `;
  }
};

export default About;
