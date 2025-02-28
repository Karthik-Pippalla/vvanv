document
  .getElementById("addItemForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const newItem = {
      title: document.getElementById("title").value,
      category: document.getElementById("category").value,
      price: document.getElementById("price").value,
      stock: document.getElementById("stock").value,
      image_url: document.getElementById("image_url").value,
      vendor: document.getElementById("vendor").value, // ✅ Ensure vendor is sent
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Menu Item Added Successfully!");
        window.location.reload();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  });
