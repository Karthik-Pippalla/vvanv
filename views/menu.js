document.getElementById("search-box").addEventListener("keyup", function () {
  let query = this.value.toLowerCase();
  document.querySelectorAll(".menu-item").forEach((item) => {
    let title = item.getAttribute("data-title");
    item.style.display = title.includes(query) ? "block" : "none";
  });
});

// Handle Edit Form Submission (Update Item)
document
  .getElementById("editItemForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const itemId = document.getElementById("edit-id").value;
    const formData = {
      title: document.getElementById("edit-title").value,
      category: document.getElementById("edit-category").value,
      price: document.getElementById("edit-price").value,
      stock: document.getElementById("edit-stock").value,
      image_url:
        document.getElementById("edit-image").value ||
        "https://t3.ftcdn.net/jpg/02/57/21/40/360_F_257214005_63auIfr9KN0gTHt28w6G8hoP2k45ScyP.jpg",
      vendor: document.getElementById("edit-vendor").value, // ✅ Ensure vendor is passed
      nutrition: {
        calories: document.getElementById("edit-calories").value || 0,
        protein: document.getElementById("edit-protein").value || 0,
        carbs: document.getElementById("edit-carbs").value || 0,
        fat: document.getElementById("edit-fat").value || 0,
      },
      allergens: document
        .getElementById("edit-allergens")
        .value.split(",")
        .map((a) => a.trim()),
    };

    try {
      const response = await fetch(`/menu/update/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        alert("Menu Item Updated Successfully!");
        location.reload();
      } else {
        alert("Error updating menu item: " + data.message);
      }
    } catch (error) {
      alert("Server error while updating item.");
      console.error("Update Error:", error);
    }
  });

// Populate Edit Form when clicking Edit button
document.querySelectorAll(".edit-btn").forEach((button) => {
  button.addEventListener("click", function () {
    document.getElementById("edit-id").value = this.getAttribute("data-id");
    document.getElementById("edit-title").value =
      this.getAttribute("data-title");
    document.getElementById("edit-category").value =
      this.getAttribute("data-category");
    document.getElementById("edit-price").value =
      this.getAttribute("data-price");
    document.getElementById("edit-stock").value =
      this.getAttribute("data-stock");
    document.getElementById("edit-image").value =
      this.getAttribute("data-image");
    document.getElementById("edit-vendor").value =
      this.getAttribute("data-vendor");

    let nutritionData = JSON.parse(this.getAttribute("data-nutrition"));
    document.getElementById("edit-calories").value = nutritionData.calories;
    document.getElementById("edit-protein").value = nutritionData.protein;
    document.getElementById("edit-carbs").value = nutritionData.carbs;
    document.getElementById("edit-fat").value = nutritionData.fat;

    let allergensData = JSON.parse(this.getAttribute("data-allergens"));
    document.getElementById("edit-allergens").value = allergensData.join(", ");
  });
});

// PAGINATION
const itemsPerPage = 6;
let menuItems = document.querySelectorAll(".menu-item");
let totalPages = Math.ceil(menuItems.length / itemsPerPage);

function showPage(page) {
  let start = (page - 1) * itemsPerPage;
  let end = start + itemsPerPage;
  menuItems.forEach((item, index) => {
    item.style.display = index >= start && index < end ? "block" : "none";
  });
}

function renderPagination() {
  let paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";
  if (totalPages > 1) {
    // ✅ Only show pagination if more than 1 page
    for (let i = 1; i <= totalPages; i++) {
      let li = document.createElement("li");
      li.classList.add("page-item");
      if (i === 1) li.classList.add("active");
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.addEventListener("click", function () {
        showPage(i);
        document
          .querySelectorAll(".page-item")
          .forEach((el) => el.classList.remove("active"));
        li.classList.add("active");
      });
      paginationContainer.appendChild(li);
    }
  }
}

showPage(1);
renderPagination();

// Handle Add Item Form Submission
document
  .getElementById("addItemForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      title: document.getElementById("title").value,
      category: document.getElementById("category").value,
      price: document.getElementById("price").value,
      stock: document.getElementById("stock").value,
      image_url:
        document.getElementById("image_url").value ||
        "https://t3.ftcdn.net/jpg/02/57/21/40/360_F_257214005_63auIfr9KN0gTHt28w6G8hoP2k45ScyP.jpg",
      vendor: document.getElementById("vendor").value, // ✅ Ensure vendor is passed
      nutrition: {
        calories: document.getElementById("calories").value || 0,
        protein: document.getElementById("protein").value || 0,
        carbs: document.getElementById("carbs").value || 0,
        fat: document.getElementById("fat").value || 0,
      },
      allergens: document
        .getElementById("allergens")
        .value.split(",")
        .map((a) => a.trim()),
    };

    try {
      const response = await fetch("/menu/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        alert("Menu Item Added Successfully!");
        location.reload();
      } else {
        alert("Error adding menu item: " + data.message);
      }
    } catch (error) {
      alert("Server error while adding item.");
      console.error("Add Error:", error);
    }
  });
