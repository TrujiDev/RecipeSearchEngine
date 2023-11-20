function startApp() {
	const selectCategories = document.querySelector('#categories');
	selectCategories.addEventListener('change', selectCategory);

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
}

document.addEventListener('DOMContentLoaded', startApp);
