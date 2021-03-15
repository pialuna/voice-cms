// ------------------------------------------------------------------
// VUEX STORE ACTIONS
// ------------------------------------------------------------------
// make API calls and commit mutations (asynchronous)

// accesses the API, that is connected to a MongoDB in the Cloud (MongoDB Atlas)

import { getProject, getCollection }  from './helpers';

const axios = require('axios');
const endpoint = 'http://localhost:1234';

export default {

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

	async createProperty({ commit, state }, payload) {
		// payload contains: name, type, i18n, collectionId, projectId
		console.log('action: createProperty');
		const collection = getCollection(state, payload.projectId, payload.collectionId);
		const properties = collection.properties;
		// concats the propsArray with an array with the new prop, 
		// because the patch request needs to send the whole array to api
		const newPropsArray = properties.concat(
			[{
				name: payload.name,
				type: payload.type,
				i18n: payload.i18n
			}]
		);
		console.log("newPropsArray: ");
		console.log(newPropsArray);
		// API Request PATCH
		try {
			const response = await axios.patch(endpoint + '/collections/' + payload.collectionId, {
				properties: newPropsArray,
			});
			console.log("API Response: PATCH COLLECTION (properties):");
			console.log(response);
			// commit mutation
			commit('CREATE_PROPERTY', {
				name: payload.name,
				type: payload.type,
				i18n: payload.i18n,
				projectId: payload.projectId,
				collectionId: payload.collectionId
			});
		} catch (error) {
			console.error(error);
		}
	},
};
