// seed sample data 

const axios = require('axios');
const endpoint = 'http://localhost:1234';

const projectId = postProject({
	name: "Quiz Game",
	locales: ["en", "de"]
});

const responsesCollectionId = postCollection({
	project_id: projectId,
	name: "Responses",
	properties: [
		{
			name: "key",
			type: "textfield",
			i18n: false
		},
		{
			name: "response",
			type: "textarray",
			i18n: true
		}
	],
	locales: ["en", "de"]
});

const responses = [
	{
		collection_id: responsesCollectionId,
		data: {
			key: "welcome",
			i18n: {
				response: {
					en: [
						"Hello, Welcome to 'True or False'. I will tell you something, and you will say if it is true or false. Let's go!",
						"Hi, Welcome to 'True or False'. I will tell you something, and you will say if it is true or false. Here we go!"
					],
					de: [
						"Wilkommen bei 'Wahr oder Falsch'! Ich werde dir etwas erzählen und du sagst, ob das wahr oder falsch ist! Los geht's!",
						"Hi! Wilkommen bei 'Wahr oder Falsch'! Ich werde dir etwas erzählen und du sagst, ob das wahr oder falsch ist! Und los!"
					]
				}
			}
		}
	},

];

postItems(responses);

const quizCollectionId = postCollection({
	project_id: projectId,
	name: "Quiz Statements",
	properties: [
		{
			name: "key",
			type: "textfield",
			i18n: false
		},
		{
			name: "statement",
			type: "textarray",
			i18n: true
		},
		{
			name: "answer",
			type: "boolean",
			i18n: false
		}
	],
	locales: ["en", "de"]
});

const quizStatements = [
	{
		collection_id: quizCollectionId,
		data: {
			key: "qs0",
			i18n: {
				statement: {
					en: [
						"Mount Everest is the tallest mountain in the world. "
					],
					de: [
						"Mount Everest ist der höchste Berg der Welt."
					]
				}
			},
			answer: true
		}
	},

];

postItems(quizStatements);

const soundCollectionId = postCollection({
	project_id: projectId,
	name: "Sound",
	properties: [
		{
			name: "key",
			type: "textfield",
			i18n: false
		},
		{
			name: "soundbank_url",
			type: "url",
			i18n: false
		},
		{
			name: "https_url",
			type: "audiourl",
			i18n: false
		}
	],
	locales: ["en", "de"]
});

const sounds = [
	{
		collection_id: soundCollectionId,
		data: {
			key: "intro",
			soundbank_url: "soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_intro_01",
			https_url: "https://d3qhmae9zx9eb.cloudfront.net/ui/gameshow/amzn_ui_sfx_gameshow_intro_01.mp3"
		}
	},

];

postItems(sounds);


export default {

	async postProject(payload) {
		const response = await axios.post(endpoint + '/projects/', {
			name: payload.name,
			locales: payload.locales
		});
		console.log("Posted Project: ", response.data.createdProject._id);
		return response.data.createdProject._id;
	},

	async postCollection(payload) {
		const response = await axios.post(endpoint + '/collections/', {
			project_id: payload.project_id,
			name: payload.name,
			properties: payload.properties,
			locales: payload.locales
		});
		console.log("Posted Collection: ", response.data.createdCollection._id);
		return response.data.createdCollection._id;
	},

	async postItem(payload) {
		const response = await axios.post(endpoint + '/items/', {
			collection_id: payload.collection_id,
			data: payload.data
		});
		console.log("Posted Item: ", response.data.createdItem._id);
		return response.data.createdItem._id;
	},

	postItems(items) {
		for (item in items) {
			this.postItem({
				collection_id: item.collection_id,
				data: item.data
			});
		}
	},

};