// Örnek Tarif Veritabanı
const recipeDatabase = [
  {
    id: 1,
    title: "Menemen",
    ingredients: ["yumurta", "domates", "biber", "sıvı yağ", "tuz"],
    instructions: "Biberleri ve domatesleri soteleyin, yumurtaları kırıp pişirin."
  },
  {
    id: 2,
    title: "Domates Çorbası",
    ingredients: ["domates", "un", "tereyağı", "süt", "tuz"],
    instructions: "Unu tereyağında kavurun, rendelenmiş domates ve sütü ekleyip kaynatın."
  },
  {
    id: 3,
    title: "Krep",
    ingredients: ["un", "süt", "yumurta", "tuz", "sıvı yağ"],
    instructions: "Malzemeleri çırpın, kızgın tavada arkalı önlü pişirin."
  }
];

const selectedIngredients = new Set();

// DOM Elementleri
const ingredientInput = document.getElementById("ingredientInput");
const addBtn = document.getElementById("addBtn");
const selectedBadges = document.getElementById("selectedBadges");
const searchRecipesBtn = document.getElementById("searchRecipesBtn");
const recipeGrid = document.getElementById("recipeGrid");

// Malzeme Ekleme
function addIngredient(name) {
  const cleanName = name.trim().toLowerCase();
  if (cleanName && !selectedIngredients.has(cleanName)) {
    selectedIngredients.add(cleanName);
    renderBadges();
    ingredientInput.value = "";
  }
}

// Rozetleri Çizdirme
function renderBadges() {
  selectedBadges.innerHTML = "";
  selectedIngredients.forEach((item) => {
    const badge = document.createElement("div");
    badge.className = "badge";
    badge.innerHTML = `${item} <span onclick="removeIngredient('${item}')">&times;</span>`;
    selectedBadges.appendChild(badge);
  });
}

// Malzeme Çıkarma
function removeIngredient(name) {
  selectedIngredients.delete(name);
  renderBadges();
}

// Tarif Filtreleme ve Listeleme
function filterRecipes() {
  recipeGrid.innerHTML = "";
  const selectedArray = Array.from(selectedIngredients);

  if (selectedArray.length === 0) {
    recipeGrid.innerHTML = "<p>Lütfen önce elinizdeki malzemeleri ekleyin.</p>";
    return;
  }

  const results = recipeDatabase.map((recipe) => {
    const matched = recipe.ingredients.filter((ing) => selectedIngredients.has(ing));
    const matchPercentage = Math.round((matched.length / recipe.ingredients.length) * 100);
    return { ...recipe, matchedCount: matched.length, matchPercentage };
  }).filter((recipe) => recipe.matchedCount > 0);

  // En yüksek eşleşmeye göre sıralama
  results.sort((a, b) => b.matchPercentage - a.matchPercentage);

  if (results.length === 0) {
    recipeGrid.innerHTML = "<p>Uygun tarif bulunamadı.</p>";
    return;
  }

  results.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <h3>${recipe.title}</h3>
      <span class="match-rate">%${recipe.matchPercentage} Uyum</span>
      <p><strong>Malzemeler:</strong> ${recipe.ingredients.join(", ")}</p>
      <p style="margin-top: 8px;">${recipe.instructions}</p>
    `;
    recipeGrid.appendChild(card);
  });
}

// Event Listeners
addBtn.addEventListener("click", () => addIngredient(ingredientInput.value));
ingredientInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addIngredient(ingredientInput.value);
});
searchRecipesBtn.addEventListener("click", filterRecipes);
