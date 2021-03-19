// ------------------------------------------------------------------
// VUEX STORE GETTERS
// ------------------------------------------------------------------
// get objects from the state

export default {

	projects(state) {
		console.log('getter: projects');
		return state.projects;
	},
	project(state) {
		console.log('getter: project');
		return (projectId) => {
			const project = state.projects.find(project => project._id === projectId);
			return project;
		}
	},
	collections(state) {
		console.log('getter: collections');
		return (projectId) => {
			const project = state.projects.find(project => project._id === projectId);
			console.log(project);
			return project.collections;
		}
	},
	collection(state) {
		console.log('getter: collection');
		return (projectId, collectionId) => {
			const project = state.projects.find(project => project._id === projectId);
			const collection = project.collections.find(collection => collection._id === collectionId);
			return collection;
		}
	},
	item(state) {
		console.log('getter: item');
		return (projectId, collectionId, itemId) => {
			const project = state.projects.find(project => project._id === projectId);
			const collection = project.collections.find(collection => collection._id === collectionId);
			const item = collection.items.find(item => item._id === itemId);
			return item;
		}
	}
};