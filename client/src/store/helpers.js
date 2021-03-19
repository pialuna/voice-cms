// helper functions 
// to do: refactor

function getProject(state, projectId) {
	const project = state.projects.find(project => project._id === projectId);
	return project;
}

function getCollection(state, projectId, collectionId) {
	const project = state.projects.find(project => project._id === projectId);
	const collection = project.collections.find(collection => collection._id === collectionId);
	return collection;
}

function getItem(state, projectId, collectionId, itemId) {
	const project = state.projects.find(project => project._id === projectId);
	const collection = project.collections.find(collection => collection._id === collectionId);
	const item = collection.items.find(item => item._id === itemId);
	return item;
}

function getPlaceholderValue(type) {
	switch (type) {
		case "plaintext":
		case "textfield":
			return "text";
		case "urlfield":
		case "audiourl":
		case "imageurl":
			return "https://";
		case "textarray":
			return ["text"];
		case "tags":
			return [];
		case "boolean":
		case "checkbox":
			return false;
		case "date":
			return "";
		default:
			return null;
	}
}

export { getProject, getCollection, getItem, getPlaceholderValue } 