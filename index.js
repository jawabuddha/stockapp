// Stock Market App to lookup stock quotes

const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const path = require('path');


// USE SERVER PORT OR 5000;
const PORT = process.env.PORT || 5000;

// set handle bars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// constants for web page display
const otherstuff = "Welcome to the Stock Application."

// Set handlebar routes
app.get('/', function (req, res) {
    res.render('home', {
    	intro: otherstuff,
    	content: "You can use the Stock Market App to lookup stock quotes."
    });
});

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log("Server listening on port "+ PORT));

