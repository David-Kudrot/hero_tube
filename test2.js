const buttonsContainer = document.getElementById("categoryButtonContainer");
const contentContainer = document.getElementById("videosCardContainer");
let currentData = []; // Initialize an empty array to store fetched data

const renderDataById = (categoryId) => {
  fetch(
    `https://openapi.programming-hero.com/api/videos/category/${categoryId}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((allData) => {
      contentContainer.innerHTML = ""; // Remove previous content

      currentData = allData.data; // Store the fetched data

      const hasData = currentData && currentData.length > 0;

      hasData
        ? currentData.forEach((data) => {
            const card = createCard(data);
            contentContainer.appendChild(card);
          })
        : renderEmptyDataError(categoryId);
    })
    .catch((error) => {
      contentContainer.innerHTML = ""; // Clear previous content

      if (categoryId === "drawing") {
        renderEmptyDataError(categoryId);
      } else {
        console.error("Error fetching data by ID:", error);
      }
    });
};

// Function to parse views string to numeric value
const parseViews = (viewsString) => {
  const views = parseFloat(viewsString);

  if (viewsString.includes("K")) {
    return views * 1000;
  } else if (viewsString.includes("M")) {
    return views * 1000000;
  } else {
    return views;
  }
};

const sortByViews = () => {
  if (currentData.length === 0) {
    return; // No data available
  }

  currentData.sort((a, b) => {
    const viewsA = parseViews(a.others.views || "0");
    const viewsB = parseViews(b.others.views || "0");
    return viewsB - viewsA; // Sort in descending order by views
  });

  console.log(currentData); // Log the sorted data to check in the console

  contentContainer.innerHTML = ""; // Clear current content

  currentData.forEach((data) => {
    const card = createCard(data);
    contentContainer.appendChild(card);
  });
};

// Event listener for the "Sort by View" button
const sortByViewsButton = document.getElementById("sortByViewsButton");
sortByViewsButton.addEventListener("click", () => {
  sortByViews();
});

const renderEmptyDataError = (categoryId) => {
  const errorMessage = document.createElement("div");
  errorMessage.className = "col-12 text-center";
  errorMessage.innerHTML = `
    <img src="Icon.png" alt="Error" style="max-width: 200px;">
    <p>Failed to load ${categoryId} category. Please try again later.</p>
  `;
  contentContainer.appendChild(errorMessage);
};

const createCard = (data) => {
  console.log(data);
  const card = document.createElement("div");
  card.className = "col-md-6 col-lg-3 mb-4";

  let spanHTML = "";
  if (data.authors[0].verified == true) {
    spanHTML = `<i class="bi bi-patch-check-fill"></i>`;
  } else {
    spanHTML = "";
  }

  let cardHTML = `
    <div class="card">
        <div class="img-wrapper">
          <img src="${data.thumbnail}" class="card-img-top" alt="${data.title}" >
        </div>
        <div class="card-body">
            <h5 class="card-title">${data.title}</h5>
            <p class="card-text pb-0 mb-0">${data.authors[0].profile_name}<span class="verified ms-2">${spanHTML}</span></p>
            <p class="card-text">${data.others.views} views</p>
        </div>
    </div>
    `;

  card.innerHTML = cardHTML;
  return card;
};

fetch("https://openapi.programming-hero.com/api/videos/categories")
  .then((res) => res.json())
  .then((categories) => {
    renderToButtons(categories.data);
  })
  .catch((error) => {
    console.error("Error fetching categories:", error);
  });

const renderToButtons = (categories) => {
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.category;
    button.className = "btn btn-primary mr-2 mb-2";

    button.addEventListener("click", () => {
      renderDataById(category.category_id);
    });

    if (category.category === "All") {
      button.id = "allButton";
      button.click();
    }

    buttonsContainer.appendChild(button);
  });
};
