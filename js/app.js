function startApp() {
	const selectCategories = document.querySelector('#categories');

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

	function showCategories(categories = []) {
		categories.forEach(category => {
			const { strCategory } = category;

			const option = document.createElement('OPTION');
			option.value = strCategory;
			option.textContent = strCategory;

			selectCategories.appendChild(option);
		});
	}
}

document.addEventListener('DOMContentLoaded', startApp);
