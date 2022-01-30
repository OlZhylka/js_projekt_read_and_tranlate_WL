const ReadPage = {
  id: "read",
  title: "Читалка",
  insert: (data, readDetails) => {
    readDetails.innerHTML = `<iframe src="https://wolnelektury.pl/katalog/lektura/${data}.html#book-text" width="100%" height="1000" title="Iframe Example"></iframe>`;
  },
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
        <div class="read__details" id="readDetails"></div>
        <div id="end"></div>
      </section>
    `;
  }
};

export default ReadPage;
