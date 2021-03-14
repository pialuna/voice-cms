import Vue from 'vue';
import Vuex from 'vuex';

// accesses the Content Server API, that is connected to a MongoDB in the Cloud (MongoDB Atlas)

const axios = require('axios');
const endpoint = 'http://localhost:1234';

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		projects: [],
	},

// ______________________________ VUEX MUTATIONS ______________________________
// update the state (synchronous)
	mutations: {
		'INIT_PROJECTS'(state, payload) {
			// payload contains: projects
			console.log('mutation: INIT_PROJECTS');
			state.projects = payload.projects;
		},

		'INIT_PROJECT'(state, payload) {
			// payload contains: project
			console.log('mutation: INIT_PROJECT');
			console.log(payload.project);
			const projectInState = getProject(state, payload.project._id);
			if (!projectInState) {
				console.log('add loaded project to state');
				state.projects.push(payload.project);
			} else {
				console.log('replace the project in state with the loaded one');
				const index = state.projects.indexOf(projectInState);
				Vue.set(state.projects, index, payload.project);
			}
		},

		'CREATE_PROJECT'(state, payload) {
			// payload contains: projectName, locales string-array, new projectId
			console.log('mutation: CREATE_PROJECT');
			state.projects.push({
				_id: payload.projectId,
				name: payload.projectName,
				locales: payload.locales,
				collections: []
			});
		},

		// not needed? 
		// 'INIT_COLLECTIONS'(state, payload) {
		// 	// payload contains: projectId, collections
		// 	console.log('mutation: INIT_COLLECTIONS');
		// 	console.log(payload.collections);
		// 	// find this project in the state 
		// 	const project = getProject(state, payload.projectId);
		// 	// and set its collections to the given collections
		// 	Vue.set(project, "collections", payload.collections);
		// },
		
		'INIT_COLLECTION'(state, payload) {
			// payload contains: projectId, collection
			console.log('mutation: INIT_COLLECTION');
			console.log(payload.collection);
			// find this collection in the state 
			const project = getProject(state, payload.projectId);
			const collection = getCollection(state, payload.projectId, collection._id);
			const index = project.collections.indexOf(collection);
			Vue.set(project.collections, index, payload.collection);
		},

		'CREATE_COLLECTION'(state, payload) {
			// payload contains: collectionName, properties obj-array, locales string-array, new collectionId, projectId
			console.log('mutation: CREATE_COLLECTION');
			// find this project in the state 
			const project = getProject(state, payload.projectId);
			project.collections.push({
				name: payload.collectionName,
				_id: payload.collectionId,
				properties: payload.properties,
				locales: payload.locales,
				items: []
			});
		},

		'NEW_ITEM'(state, payload) {
			// payload contains: projectId, collectionId
			console.log('mutation: NEW_ITEM');
			// find this collection 
			const collection = getCollection(state, payload.projectId, payload.collectionId);
			// delete empty "new items", if add-button got clicked several times
			for (let i = 0; i < collection.items.length; i++) {
				let item = collection.items[i];
				if (item._id === "new") {
					collection.items.splice(i, 1);
					console.log('removed old opened "new item"');
					i--;
				}
			}
			let item = {
				_id: "new", // needed as a placeholder id, as long as it's not saved in DB
				data: {}
			};
			collection.properties.forEach(property => {
				const placeholder = getPlaceholderValue(property.type);
				if (property.i18n) {
					if (!item.data.i18n) {
						Vue.set(item.data, "i18n", {});
					}
					// save this property in item.data.i18n
					Vue.set(item.data.i18n, property.name, {});
					// for each locale, save a placeholder in item.data.i18n[locale]
					collection.locales.forEach(locale => {
						Vue.set(item.data.i18n[property.name], locale, placeholder);
					});
				} else {
					Vue.set(item.data, property.name, placeholder);
				}
			});
			// and add the new empty item to store
			collection.items.unshift(item);
		},

		'SAVE_NEW_ITEM'(state, payload) {
			// payload contains: item, projectId, collectionId
			console.log('mutation: SAVE_NEW_ITEM');
			console.log(payload.item);
			// find this collection
			const collection = getCollection(state, payload.projectId, payload.collectionId);
			// delete empty "new items", if add-button got clicked several times
			for (let i = 0; i < collection.items.length; i++) {
				let item = collection.items[i];
				if (item._id === "new") {
					collection.items.splice(i, 1);
					console.log('removed old opened "new item"');
					i--;
				}
			}
			// and add the new item 
			collection.items.unshift(payload.item);
		},
		'UPDATE_ITEM'(state, payload) {
			// payload contains: item, projectId, collectionId
			console.log('mutation: UPDATE_ITEM');
			console.log(payload.item);
			// find this item in the state
			const collection = getCollection(state, payload.projectId, payload.collectionId);
			const itemInStore = getItem(state, payload.projectId, payload.collectionId, payload.item._id);
			if (!itemInStore.data) {
				itemInStore.data = {}
			}
			// and set every single property
			collection.properties.forEach(property => {
				if (property.i18n) {
					// set item.data.i18n 
					console.log("set " + property.name + " in data.i18n");
					Vue.set(itemInStore.data.i18n, property.name, payload.item.data.i18n[property.name]);
				} else {
					// set item.data = {}
					console.log("set " + property.name + " in data");
					Vue.set(itemInStore.data, property.name, payload.item.data[property.name]);
				}
			});
			console.log(itemInStore);
			// Vue.set(itemInStore, data, payload.item.data); // setting complete data obj didnt work?
		},
		
		'DELETE_ITEM'(state, payload) {
			// payload contains: itemId, projectId, collectionId
			console.log('mutation: DELETE_ITEM');
			console.log(payload.itemId);
			// find this item in the state and delete it
			const collection = getCollection(state, payload.projectId, payload.collectionId);
			const item = getItem(state, payload.projectId, payload.collectionId, payload.itemId);
			const index = collection.items.indexOf(item);
			collection.items.splice(index, 1);
		},

		'CREATE_PROPERTY'(state, payload) {
			// payload contains: name, type, i18n, projectId, collectionId
			console.log('mutation: CREATE_PROPERTY');
			// find this collection in the state 
			const collection = getCollection(state, payload.projectId, payload.collectionId);
			collection.properties.push({
				name: payload.name,
				type: payload.type,
				i18n: payload.i18n
			});
			const placeholder = getPlaceholderValue(payload.type);
			collection.items.forEach(item => {
				if (!item.data) {
					Vue.set(item, "data", {});
				}
				// if this property has i18n 
				if (payload.i18n) {
					if (!item.data.i18n) {
						Vue.set(item.data, "i18n", {});
					}
					// save this property in item.data.i18n
					Vue.set(item.data.i18n, payload.name, {});
					// for each locale, put a placeholder value in item.data.i18n[locale]
					collection.locales.forEach(locale => {
						console.log(locale);
						Vue.set(item.data.i18n[payload.name], locale, placeholder);
						console.log(item);
					});
				} else {
					Vue.set(item.data, payload.name, placeholder);
				}
			});
			console.log("complete state after adding the prop: ");
			console.log(state);
		},
	},

// ______________________________ VUEX ACTIONS ______________________________
// make api calls and commit (asynchronous)
	actions: {
		async initProjects({ commit }) {
			console.log('action: initProjects');
			try {
				const response = await axios.get(endpoint + '/projects');
				console.log("API Response: GET PROJECTS:");
				console.log(response);
				// commit mutation
				if (!response.data.projects) {
					// error handling ?
				}
				commit('INIT_PROJECTS', {
					projects: response.data.projects,
				});
			} catch (error) {
				console.error(error);
			}
		},

		async initProject({ commit }, payload) {
			// payload contains: projectId
			console.log('action: initProject');
			try {
				// load only project information without
				// const response = await axios.get(endpoint + '/projects/' + payload.projectId);
				// load complete project with all its collections and items with "?complete=true"
				const response = await axios.get(endpoint + '/projects/' + payload.projectId + '?complete=true');
				console.log("API Response: GET PROJECT:");
				console.log(response);
				// commit mutation
				commit('INIT_PROJECT', {
					project: response.data.project
				});
			} catch (error) {
				console.error(error);
			}
		},

		async createProject({ commit }, payload) {
			// payload contains: projectName,locales string-array
			console.log('action: createProject');
			// API Request POST 
			console.log("POST REQUEST TO API");
			try {
				const response = await axios.post(endpoint + '/projects/', {
					name: payload.projectName,
					locales: payload.locales
				});
				console.log("API Response: POST PROJECT:");
				console.log(response);
				// get createdItem with database id from api response
				const createdProject = response.data.createdProject;
				// commit mutation
				commit('CREATE_PROJECT', {
					projectId: createdProject._id,
					projectName: createdProject.name,
					locales: createdProject.locales,
				});
			} catch (error) {
				console.error(error);
			}

		},

		// not needed? 
		// async initCollections({ commit }, payload) {
		// 	// payload contains: projectId
		// 	console.log('action: initCollections');
		// 	try {
		// 		const response = await axios.get(endpoint + '/collections');
		// 		console.log("API Response: GET COLLECTIONS:");
		// 		console.log(response);
		// 		// commit mutation
		// 		commit('INIT_COLLECTIONS', {
		// 			projectId: payload.projectId,
		// 			collections: response.data.collections
		// 		});
		// 	} catch (error) {
		// 		console.error(error);
		// 	}
		// },

		async initCollection({ dispatch, commit, state }, payload) {
			// payload contains: projectId, collectionId
			console.log('action: initCollection');
			console.log(payload);
			try {
				const response = await axios.get(endpoint + '/collections/' + payload.collectionId);
				console.log("API Response: GET COLLECTION:");
				console.log(response);
				const projectInState = getProject(state, payload.projectId);
				// in case the collection is called directly through its url -> collections undefined
				// does not work ???
				if (!projectInState.collections) {
					console.log('!project.collections');
					console.log(projectInState);
					await dispatch("initProject", {
						projectId: payload.projectId
					});
					// const projectResponse = await axios.get(endpoint + '/projects/' + payload.projectId);
					// commit('INIT_COLLECTIONS', {
					// 	projectId: payload.projectId,
					// 	collections: projectResponse.data.project.collections
					// });
				}
		// ***** currently disabled because complete project gets loaded in initProject() *****
				// commit('INIT_COLLECTION', {
				// 	projectId: payload.projectId,
				// 	collection: response.data.collection
				// });
			} catch (error) {
				console.error(error);
			}
		},

		// initCollection_OLD({ dispatch, commit, state }, payload) {
		// 	// payload contains: projectId, collectionId
		// 	console.log('action: initCollection');
		// 	console.log(payload);
		// 	// load collection from dummy api
		// 	const project = dummyData.projects.find(project => project._id === payload.projectId);
		// 	const collection = project.collections.find(collection => collection._id === payload.collectionId);
		// 	console.log('loaded collection: ');
		// 	console.log(collection);
		// 	const projectInState = state.projects.find(project => project._id === payload.projectId);
		// 	// console.log(projectInState);
		// 	// in case the collection is called directly through its url -> !collections
		// 	if (!projectInState.collections) {
		// 		console.log('!project.collections');
		// 		dispatch("initCollections", {
		// 			projectId: payload.projectId
		// 		});
		// 	}
		// 	//let collectionInState = projectInState.collections.find(collection => collection._id === payload.collectionId);
		// 	// console.log(collectionInState);
		// 	commit('INIT_COLLECTION', {
		// 		// payload
		// 		projectId: payload.projectId,
		// 		collection: collection
		// 	});
		// },

		async createCollection({ commit }, payload) {
			// payload contains: collectionName, properties obj-array, locales string-array, projectId
			console.log('action: createCollection');
			// API Request POST 
			console.log("POST REQUEST TO API");
			try {
				const response = await axios.post(endpoint + '/collections/', {
					project_id: payload.projectId,
					name: payload.collectionName,
					properties: payload.properties,
					locales: payload.locales
				});
				console.log("API Response: POST COLLECTION:");
				console.log(response);
				// get createdItem with database id from api response
				const createdCollection = response.data.createdCollection;
				// commit mutation
				commit('CREATE_COLLECTION', {
					collectionId: createdCollection._id,
					collectionName: createdCollection.name,
					properties: createdCollection.properties,
					locales: createdCollection.locales,
					projectId: createdCollection.project_id
				});
			} catch (error) {
				console.error(error);
			}
		},

		async saveItem({ commit }, payload) {
			// payload contains: the item (item._id and item.data), collectionId, projectId
			console.log('action: saveItem');
			console.log(payload.item);
			if (!payload.item._id || payload.item._id === 'new') {
				// do POST request to API
				try {
					const response = await axios.post(endpoint + '/items/', {
						collection_id: payload.collectionId,
						data: payload.item.data
					});
					console.log("API Response: POST ITEM:");
					console.log(response);
					// get createdItem with database id from api response
					const createdItem = response.data.createdItem;
					// commit mutation
					commit('SAVE_NEW_ITEM', {
						item: {
							_id: createdItem._id,
							data: createdItem.data
						},
						projectId: payload.projectId,
						collectionId: payload.collectionId
					});
				} catch (error) {
					console.error(error);
				}
			} else {
				// do PATCH request to API
				try {
					const response = await axios.patch(endpoint + '/items/' + payload.item._id, {
						data: payload.item.data
					});
					console.log("API Response: PATCH ITEM:");
					console.log(response);
					// commit mutation
					commit('UPDATE_ITEM', {
						item: payload.item,
						projectId: payload.projectId,
						collectionId: payload.collectionId
					});
				} catch (error) {
					console.error(error);
				}
			}
		},

		newItem({ commit }, payload) {
			// payload contains: collectionId, projectId
			console.log('action: newItem');
			// NO API REQUEST. this happens at 'saveItem'
			commit('NEW_ITEM', {
				projectId: payload.projectId,
				collectionId: payload.collectionId
			});
		},

		async deleteItem({ commit }, payload) {
			// payload contains: itemId, collectionId, projectId
			console.log('action: deleteItem');
			if (payload.itemId === 'new' || !payload.itemId) {
				console.log('delete new empty item -> no API Request');
				//redundant
				commit('DELETE_ITEM', {
					itemId: payload.itemId,
					projectId: payload.projectId,
					collectionId: payload.collectionId
				});
			} else {
				// do DELETE request to API
				try {
					const response = await axios.delete(endpoint + '/items/' + payload.itemId);
					console.log("API Response: DELETE ITEM:");
					console.log(response);
					// commit mutation
					commit('DELETE_ITEM', {
						itemId: payload.itemId,
						projectId: payload.projectId,
						collectionId: payload.collectionId
					});
				} catch (error) {
					console.error(error);
				}
			}
		},

		// async createProperty({ commit, state }, payload) {
		// 	// payload contains: name, type, i18n, collectionId, projectId
		// 	console.log('action: createProperty');
		// 	const collection = getCollection(state, payload.projectId, payload.collectionId);
		// 	const properties = collection.properties;
		// 	// concats the propsArray with an array with the new prop, 
		// 	// because the patch request needs to send the whole array to api
		// 	const newPropsArray = properties.concat(
		// 		[{
		// 			name: payload.name,
		// 			type: payload.type,
		// 			i18n: payload.i18n
		// 		}]
		// 	);
		// 	console.log("newPropsArray: ");
		// 	console.log(newPropsArray);
		// 	// API Request PATCH
		// 	try {
		// 		const response = await axios.patch(endpoint + '/collections/' + payload.collectionId, {
		// 			properties: newPropsArray,
		// 		});
		// 		console.log("API Response: PATCH COLLECTION (properties):");
		// 		console.log(response);
		// 		// commit mutation
		// 		commit('CREATE_PROPERTY', {
		// 			name: payload.name,
		// 			type: payload.type,
		// 			i18n: payload.i18n,
		// 			projectId: payload.projectId,
		// 			collectionId: payload.collectionId
		// 		});
		// 	} catch (error) {
		// 		console.error(error);
		// 	}
		// },
	},

// ______________________________ GETTERS ______________________________
	getters: {
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
	},
});

// ______________________________ helper functions ______________________________

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
