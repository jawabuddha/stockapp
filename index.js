// Stock Market App to lookup stock quotes

const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const path = require('path');
const request = require('request');
const HandlebarsI18n = require("handlebars-i18n");

HandlebarsI18n.init({
    resources : {
        "en" : {
            translation : {
                "phrase1": "What is good?",
                "phrase2": "{{what}} is good."
            }
        },
        "de" : {
            translation: {
                "phrase1": "Was ist gut?",
                "phrase2": "{{what}} ist gut."
           }
        }
    },
    lng : "en",
    locale: 'en'
});

HandlebarsI18n.configure([
    ["en", "PriceFormat", {currency: "USD"}],
    ["de", "PriceFormat", {currency: "EUR"}]
]);


// USE SERVER PORT OR 5000;
const PORT = process.env.PORT || 5000;

// API Key pk_217be3b5db4a4cb8bf400fd4ab1348f5
// create a function to request Stock quotes
function callAPI(finishedAPI) {
        request('https://cloud.iexapis.com/stable/stock/fb/quote?token=pk_217be3b5db4a4cb8bf400fd4ab1348f5',{json: true},(err, res, body) =>{
            if(err){return console.log(err)};
            if(res.statusCode == 200) {
                finishedAPI(body);
            };
        });
}



// set handle bars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// constants for web page display
const otherstuff = "Welcome to the Stock Application.";

// Set handlebar routes
app.get('/', function (req, res) {
    callAPI(function(doneAPI) {
            res.render('home', {
            stock: doneAPI,
        });
    }, "fb")

        
});    



// About page
app.get('/about.html', function (req, res) {
    res.render('about');
});


// Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log("Server listening on port "+ PORT));

