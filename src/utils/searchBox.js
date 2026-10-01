export function clearSearchBox(searchBox) {
    if (searchBox && typeof searchBox.clear === 'function') {
        searchBox.clear();
    }
}
