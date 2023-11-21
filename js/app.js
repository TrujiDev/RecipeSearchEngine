function startApp() {
	const selectCategories = document.querySelector('#categories');
	selectCategories.addEventListener('change', selectCategory);

	const result = document.querySelector('#result');

	const modal = new bootstrap.Modal('#modal', {});

	getCategories();

	/**
	 * Fetches the categories from the MealDB API and displays them.
	 * @function getCategories
	 * @returns {void}
	 */
	function getCategories() {
		const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
		fetch(url)
			.then(response => response.json())
			.then(result => showCategories(result.categories));
	}

	/**
	 * Displays the categories in a select element.
	 * @param {Array} categories - The array of categories to display.
	 * @returns {void}
	 */
	function showCategories(categories = []) {
		categories.forEach(category => {
			const { strCategory } = category;

			const option = document.createElement('OPTION');
			option.value = strCategory;
			option.textContent = strCategory;

			selectCategories.appendChild(option);
		});
	}

	/**
	 * Handles the selection of a category and fetches meals based on the selected category.
	 * @param {Event} event - The event object triggered by the category selection.
	 * @returns {void}
	 */
	function selectCategory(event) {
		const category = event.target.value;
		const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
		fetch(url)
			.then(response => response.json())
			.then(result => showMeals(result.meals));
	}

	/**
	 * Displays a list of meals on the webpage.
	 *
	 * @param {Array} meals - An array of meal objects.
	 */
	function showMeals(meals = []) {
		cleanHTML(result);

		const heading = document.createElement('H2');
		heading.classList.add('text-center', 'text-black', 'my-5');
		heading.textContent = meals.length ? 'Meals' : 'No meals found';
		result.appendChild(heading);

		meals.forEach(meal => {
			const { strMeal, strMealThumb, idMeal } = meal;

			const recipeContainer = document.createElement('DIV');
			recipeContainer.classList.add('col-md-4');

			const recipeCard = document.createElement('DIV');
			recipeCard.classList.add('card', 'mb-4', 'shadow-sm');

			const recipeImage = document.createElement('IMG');
			recipeImage.classList.add('card-img-top');
			recipeImage.alt = `Image of ${strMeal}`;
			recipeImage.src = strMealThumb;

			const recipeBody = document.createElement('DIV');
			recipeBody.classList.add('card-body');

			const recipeTitle = document.createElement('H3');
			recipeTitle.classList.add('card-title', 'mb-3');
			recipeTitle.textContent = strMeal;

			const recipeButton = document.createElement('BUTTON');
			recipeButton.classList.add('btn', 'btn-danger', 'w-100');
			recipeButton.textContent = 'View Recipe';
			recipeButton.onclick = function () {
				selectRecipe(idMeal);
			};

			recipeBody.appendChild(recipeTitle);
			recipeBody.appendChild(recipeButton);
			recipeCard.appendChild(recipeImage);
			recipeCard.appendChild(recipeBody);
			recipeContainer.appendChild(recipeCard);

			result.appendChild(recipeContainer);
		});
	}

	/**
	 * Fetches a recipe from the MealDB API based on the provided ID and displays it.
	 * @param {string} id - The ID of the recipe to fetch.
	 */
	function selectRecipe(id) {
		const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
		fetch(url)
			.then(response => response.json())
			.then(result => showRecipe(result.meals[0]));
	}

	function showRecipe(recipe) {
		const { idMeal, strInstructions, strMeal, strMealThumb } = recipe;

		const modalTitle = document.querySelector('.modal .modal-title');
		const modalBody = document.querySelector('.modal .modal-body');

		modalTitle.textContent = strMeal;
		modalBody.innerHTML = `
            <img src="${strMealThumb}" alt="${strMeal}" class="img-fluid mb-4" />
            <h3>Instructions</h3>
            <p>${strInstructions}</p>
            <h3>Ingredients and Measures</h3>
        `;

		const listGroup = document.createElement('UL');
		listGroup.classList.add('list-group');

		for (let i = 1; i <= 20; i++) {
			const ingredientMeasure = recipe[`strIngredient${i}`];
			const ingredientName = recipe[`strMeasure${i}`];

			if (ingredientMeasure) {
				const ingredient = document.createElement('LI');
				ingredient.classList.add('list-group-item');
				ingredient.textContent = `${ingredientMeasure} - ${ingredientName}`;
				listGroup.appendChild(ingredient);
			}
		}

		modalBody.appendChild(listGroup);

		const modalFooter = document.querySelector('.modal-footer');

		cleanHTML(modalFooter);

		const btnFavorite = document.createElement('BUTTON');
		btnFavorite.classList.add('btn', 'btn-danger', 'col');
		btnFavorite.textContent = existsFavorite(idMeal)
			? 'Remove from favorites'
			: 'Add to favorites';

		// localStorage
		btnFavorite.onclick = function () {
			if (existsFavorite(idMeal)) {
				deleteFavorite(idMeal);
				btnFavorite.textContent = 'Add to favorites';
				showToast('Removed successfully');
				return;
			}

			addFavorite({
				id: idMeal,
				name: strMeal,
				image: strMealThumb,
				instructions: strInstructions,
			});
			btnFavorite.textContent = 'Remove from favorites';
			showToast('Added successfully');
		};

		btnCloseModal = document.createElement('BUTTON');
		btnCloseModal.classList.add('btn', 'btn-secondary', 'col');
		btnCloseModal.textContent = 'Close';

		btnCloseModal.onclick = function () {
			modal.hide();
		};

		modalFooter.appendChild(btnFavorite);
		modalFooter.appendChild(btnCloseModal);

		modal.show();
	}

	/**
	 * Adds a recipe to the favorites list.
	 * @param {Object} recipe - The recipe object to be added.
	 */
	function addFavorite(recipe) {
		const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
		localStorage.setItem('favorites', JSON.stringify([...favorites, recipe]));
	}

	/**
	 * Deletes a favorite item from local storage based on its ID.
	 * @param {number} id - The ID of the favorite item to be deleted.
	 */
	function deleteFavorite(id) {
		const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
		const newFavorites = favorites.filter(favorite => favorite.id !== id);
		localStorage.setItem('favorites', JSON.stringify(newFavorites));
	}

	/**
	 * Checks if a favorite with the given id exists in the local storage.
	 * @param {string} id - The id of the favorite to check.
	 * @returns {boolean} - True if the favorite exists, false otherwise.
	 */
	function existsFavorite(id) {
		const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
		return favorites.some(favorite => favorite.id === id);
	}

	/**
	 * Displays a toast message with the given message.
	 * @param {string} msg - The message to be displayed in the toast.
	 */
	function showToast(msg) {
		const toastDiv = document.querySelector('#toast');
		const toastBody = document.querySelector('.toast-body');
		const toast = new bootstrap.Toast(toastDiv);
		toastBody.textContent = msg;
		toast.show();
	}

	/**
	 * Removes all child elements from the given selector.
	 *
	 * @param {HTMLElement} selector - The selector to clean.
	 * @returns {void}
	 */
	function cleanHTML(selector) {
		while (selector.firstChild) {
			selector.removeChild(selector.firstChild);
		}
	}
}

document.addEventListener('DOMContentLoaded', startApp);
