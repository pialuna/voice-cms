# Voice CMS 

A content management system for voice apps like Alexa Skills and Google Actions.

![Voice CMS](./docs/voice-cms.png)  

* [Introduction](#introduction)
* [Setup](#setup)
* [Features](#features)
## Introduction

The goal of this open source project is to make it easier to manage content for voice platforms like Alexa and Google Assistant. The CMS can be hosted on your own servers so that you have full control of the data.

Features include:
* **Collections**: Create various collections with different schemas, e.g. responses, business data
* **Content Types**: Supports different types of content, e.g. text, images, audio, and checkboxes
* **Localization**: Select which content types should be localized, e.g. en, de
* **Randomization**: Add content variations that are randomly picked by the voice app
* **Jovo Plugin**: Integrate CMS content with apps built with the Jovo Framework

This repository consists of the following elements:
* `api`: API that handles database calls and structures data. Built with Express.
* `client`: The CMS frontend. Built with Vue.js and Element UI.

The plugin for the Jovo Framework can be found here: [pialuna/jovo-plugin-voicecms](https://github.com/pialuna/jovo-plugin-voicecms).

## Setup 

In the root directory of the project, run:

```bash
npm install
```

This will install all dependencies for the `api` and `client`.

### Database

Voice CMS needs to be connected to a MongoDB database. You can either run your own or create a free database at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).


### API

First, create a `.env` file based on the `.env.example` file inside `/api`:

```
cd api
cp .env.example .env
```

Add the URI to your MongoDB to the `.env`:

```
MONGO_URI=<your-mongodb-uri>
```

You can then start the server:

```bash
npm run start
```
### Client

To start the Vue.js application, do the following:

```bash
cd client
npm run dev
```

Then go to `localhost:8080` to view the app.

### Integration

Install the Jovo Framework plugin like this:

```bash
npm install --save jovo-plugin-voicecms
```

You can find the full documentation for the plugin here: [pialuna/jovo-plugin-voicecms](https://github.com/pialuna/jovo-plugin-voicecms)
    
## Features

### Collections

A Voice CMS project contains one or more collections. A collection represents a specific content schema that is used by the voice app. It can be seen as a table that has at least two properties that are represented as columns.

For example, a `Responses` collection may be used to manage the voice app's responses. It includes at least two columns:
* A `key` used as identifier
* A `response` text array field that contains the app output

![Responses Collection](/docs/responses-collection.png)  

Each row can be edited. More elements can be added to the `responses` array as well:

![Edit Responses Collection](/docs/responses-edit-english.png)  

### Content Types (Columns)

Each collection consists of at least two properties (columns) that can have different types.

The following property types are supported:
* **Text Array**: Typically used for responses, if more than one value is available, the voice app selects a random item. Can contain `{{variables}}`
* **Textfield**: A regular one line short text, e.g. `key`
* **Audio URL**: A URL that is displayed as an audio element
* **Image URL**: A URL that is displayed as an image
* **Tags**: One or more tags
* **Checkbox**: A boolean value that is displayed as checkbox
* **Boolean**: A boolean value that is displayed as switch, showing 'true' or 'false' as words  
* **Date**: A date picker
* **URL**: A clickable URL

For example, audio URLs are displayed like this:

![Sound Collection](/docs/sound-collection.png)  

Booleans and checkboxes look like this:

![Statements Collection](/docs/quizstatements-collection.png)  



### Internationalization (i18n)

Voice CMS supports internationalization, which means that its content can be translated into multiple languages.

Inside a collection, there is a toggle to switch between locales:

![German Responses Collection](/docs/responses-edit-german.png)  

The properties that have i18n are marked with the locale icon next to the property name in the table header.

All properties with internationalization are in a nested `i18n`-object:

```javascript
{
        key: "qs0",
        i18n: {
          statement: {
            en: ["Mount Everest is the tallest mountain in the world. "],
            de: ["Mount Everest ist der höchste Berg der Welt."]
          }
        },
        answer: true,
        live: true
}
```  
### API

The API contains the following endpoints:

```
localhost:1234/projects
	      /projects/:id
	      /collections/
	      /collections/:id
	      /items/
	      /items/:id
```

To get a complete project (with all its collections and with all items of each collection), send `GET` to `/projects/<your-project-id>?complete=true`. The Jovo Plugin gets the data of a project this way.