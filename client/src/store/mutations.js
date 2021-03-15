// ------------------------------------------------------------------
// VUEX STORE MUTATIONS
// ------------------------------------------------------------------
// update the state (synchronous)

import Vue from 'vue';
import { getProject, getCollection, getItem, getPlaceholderValue } from './helpers';

export default {

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
};