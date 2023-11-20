function startApp() {
	const selectCategories = document.querySelector('#categories');
	selectCategories.addEventListener('change', selectCategory);

	const result = document.querySelector('#result');

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
			recipeButton.href = `recipe.html?id=${idMeal}`;

			recipeBody.appendChild(recipeTitle);
			recipeBody.appendChild(recipeButton);
			recipeCard.appendChild(recipeImage);
			recipeCard.appendChild(recipeBody);
			recipeContainer.appendChild(recipeCard);

			result.appendChild(recipeContainer);
		});
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
