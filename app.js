/* for views => allData.data[0].others.views 
for image => allData.data[0].thumbnail
*/

const buttonsContainer = document.getElementById("categoryButtonContainer");
const contentContainer = document.getElementById("videosCardContainer");

const renderDataById = (categoryId) => {
  fetch(
    `https://openapi.programming-hero.com/api/videos/category/${categoryId}`
  )
    .then((res) => res.json())
    .then((allData) => {
      contentContainer.innerHTML = ""; //remove previous content

      console.log(allData.data);

      allData.data.forEach((data) => {
        const card = create_card(data);
        contentContainer.appendChild(card);
      });
    });
};

const create_card = (data) => {
  const card = document.createElement("div");
  card.className = "col-md-3 mb-4";

  let cardHTML = `
    <div class="card">
        <img src="${data.thumbnail}" class="card-img-top" alt="${data.title}" >
        <div class="card-body">
            <h4 class="card-title">${data.title}</h4>
            <p class="card-text">${data.description}</p>
        </div>
    </div>
    `;

  card.innerHTML = cardHTML;
  return card;
};

// fetch all categories API

fetch("https://openapi.programming-hero.com/api/videos/categories")
  .then((res) => res.json())
  .then((categories) => {
    console.log(categories.data);

    renderToButtons(categories.data);
  })
  .catch((error) => {
    console.error("Error: ", error);
  });

const renderToButtons = (categories) => {
  // console.log(categories[0]);

  categories.forEach((category) => {
    console.log(category.category);

    const button = createElement("button");


    button.textContent = category.category;
    button.className = "btn btn-primary mr-2 mb-2";

    button.addEventListener("click", () => {
        console.log(category.category_id)
      renderDataById(category.category_id);
    });

    buttonsContainer.appendChild(button);
  });
};


