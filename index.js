// Stock Market App to lookup stock quotes

const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const path = require('path');
const request = require('request');
const HandlebarsI18n = require('handlebars-i18n');
const bodyParser = require('body-parser');
// USE SERVER PORT OR 5000;
const PORT = process.env.PORT || 5000;

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
    locales:"en"
});

//use body parser middleware
//app.use(bodyParser.urlencoded({entended : false})); deprecated -- call separately
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


// API Key pk_217be3b5db4a4cb8bf400fd4ab1348f5
// create a function to request Stock quotes
function callAPI(finishedAPI, ticker) {
        request('https://cloud.iexapis.com/stable/stock/'+ticker+'/quote?token=pk_217be3b5db4a4cb8bf400fd4ab1348f5',{json: true},(err, res, body) =>{
            if(err){return console.log(err)};
            if(res.statusCode == 200) {
                finishedAPI(body);
            };
        });
}



// set handle bars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
  extended: false
}));

// constants for web page display
const otherstuff = "Welcome to the Stock Application.";

// Set handlebar index GET routes
app.get('/', function (req, res) {
    callAPI(function(doneAPI) {
            res.render('home', {
            stock: doneAPI,
        });
    }, "fb")

        
});    

// // Set handlebar index GET routes
app.post('/', function (req, res) {
    callAPI(function(doneAPI) {
//            result = req.body.stock_ticker;
            res.render('home', {
            stock: doneAPI,
//            posted_stuff : result
        });
    }, req.body.stock_ticker)

        
});    



// About page
app.get('/about.html', function (req, res) {
    res.render('about');
});


// Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log("Server listening on port "+ PORT));
