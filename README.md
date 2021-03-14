# Voice CMS 

A content management system for voice apps like Alexa Skills and Google Actions.

`TODO`: Screenshot or gif
## Introduction

The goal of this open source project is to make it easier to manage content for voice platforms like Alexa and Google Assistant. The CMS can be hosted on your own servers so that you have full control of the data.

Features include:
* **Collections**: Create various collections with different schemas, e.g. responses, business data
* **Content Types**: Supports different types of content, e.g. text, images, audio, and checkboxes
* **Localization**: Select which content types should be translatable
* **Randomization**: Add content variations that are randomly picked by the voice app
* **Jovo Plugin**: Integrate CMS content with apps built with the Jovo Framework

This repository consists of the following elements:
* `api`: API that handles database calls and structures data. Built with Express.
* `client`: The CMS frontend. Built with Vue.js and Element UI.

The plugin for the Jovo Framework can be found here: xxx

## Setup 

In the root directory of the project, run:

```bash
npm install
```

This will install all dependencies for the `api` and `client`.

### Database

Voice CMS needs to be connected to a MongoDB database. The easiest way to get started is to create a free database at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).


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

You can find the full documentation for the plugin here: xxx
    
## Features

You can create collections, that are represented as tables.   
These collections can have different properties (columns), like you need it for your project.  

### There are different PropertyTypes:  
**Text Array** (an array of long texts, that can contain {{variables}} for voice response texts)      
**Textfield** (a regular one line short text)   
**URL**   
**Audio URL** (an url that is displayed as an audio element)    
**Image URL** (an url that is displayed as an image)    
**Tags**  
**Checkbox**    
**Boolean** (a switch, that displays 'true' or 'false' as a word)  
**Date**    
   
____
If there are `{{variables}}` in the texts in the `TextArray` vue component, they are displayed as little tags.   
   
While in the `Collection` vue component, all variables are pulled out of all texts of this Collection 
and are displayed on the top. There you can enter example values. These variables are passed down as objects (with name and value) to the TextArray component, where they are displayed. (Currently this solution is not reactive, you have to click edit and cancel on the certain item (to rerender it), where the variable value should be displayed.)

### Responses Collection
with 'key' as a textfield, and 'response' as a textarray
![Responses Collection](/client/docs/responses.png) 
____
The properties, that have i18n, are marked with the locale icon next to the property name in the table header.   
   
### Quiz Statements Collection
with 'key' as a textfield, 'statement' as a textarray, 'answer' as boolean, 'live' as a checkbox
![Quiz Statements Collection](/client/docs/quizstatements.png)  
____
    

**An item of the 'Statements' collection in the `Item`-component looks like this:**   
Only the needed `data`.   
All properties, that have internationalization, are in the nested `i18n`-object.   
The `Item`-component has the `item`(-data) as an object, and a copy, that is named `tempItem`. This `tempItem` is the object that is being edited. When it is saved, it overwrites the `item` in the Vuex Store and everything gets updated.   
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
**But in the `Vuex Store`, it looks like this:**   
`_id`, `collection_id`, and the `data`-object (like you get it from the API)   
The Vuex Store is the "source of truth".
```javascript
{
            _id: "5ca765274ee14003197a0f64",
            collection_id: "5ca764f54ee14003197a0f63",
            data: {
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
}
```


**The 'Statements' collection in the `Vuex Store` looks like this:**
```javascript
{
        _id: "5ca764f54ee14003197a0f63",
        project_id: "5ca34027f984f508a0c22d8b",
        name: "Statements",
        properties: [
          { name: "key", type: "textfield", i18n: false },
          { name: "statement", type: "textarray", i18n: true },
          { name: "answer", type: "boolean", i18n: false },
          { name: "live", type: "checkbox", i18n: false,}
        ],
        locales: ["en", "de"],
        items: [
		// ... all the items
        ],
}
```

**The 'Quiz Game' Project in the `Vuex Store` looks like this:**
```javascript
{
        _id: "5ca34027f984f508a0c22d8b",
        name: "Quiz Game",
        locales: ["en", "de"],
        collections: [
        // ... all the collections (with all the items)
        ]
 }
```

