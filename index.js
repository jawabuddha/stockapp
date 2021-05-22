// Stock Market App to lookup stock quotes

const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const path = require('path');
const request = require('request');

// USE SERVER PORT OR 5000;
const PORT = process.env.PORT || 5000;

// API Key pk_217be3b5db4a4cb8bf400fd4ab1348f5
request('https://cloud.iexapis.com/stable/stock/fb/quote?token=pk_217be3b5db4a4cb8bf400fd4ab1348f5',{json: true},(err, res, body) =>{
    if(err){return console.log(err)};
    if(res.statusCode == 200) {
        console.log(body);
    };
});


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

// About page
app.get('/about.html', function (req, res) {
    res.render('about');
});


// Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log("Server listening on port "+ PORT));

