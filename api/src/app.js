const express = require('express');
const app = express();
const morgan = require('morgan'); //for logging requests
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');

const itemsRoutes = require('./routes/items');
const collectionsRoutes = require('./routes/collections');
const projectsRoutes = require('./routes/projects');


mongoose.connect(
	process.env.MONGO_URI,
	{
		useMongoClient: true
	}
);
mongoose.Promise = global.Promise

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// against Cross-Origin Resource Sharing (CORS)-Errors  ->  different clients can have access
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
	  "Access-Control-Allow-Headers",
	  "Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

// Routes
app.use('/items', itemsRoutes);
app.use('/collections', collectionsRoutes);
app.use('/projects', projectsRoutes);

// Error Handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;