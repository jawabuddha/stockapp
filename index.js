// Stock Market App to lookup stock quotes

const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const path = require('path');
const request = require('request');

const bodyParser = require('body-parser');
// USE SERVER PORT OR 5000;
const PORT = process.env.PORT || 5000;

const Handlebars = require('handlebars');
const i18next = require('i18next');
const HandlebarsI18n = require('handlebars-i18n');
//const HandlebarsI18n = require('../../dist/handlebars-i18n.js');

// -- The translation phrases for i18next
i18next.init({
    resources : {
      'en' : {
        translation : {
          'key0': 'Change Language to',
          'key1': 'What is good?',
          'key2': '{{what}} is good.',
          'key3WithCount': '{{count}} item',
          'key3WithCount_plural': '{{count}} items',
          'key4': 'Selected Language is:'
        }
      },
      'de' : {
        translation: {
          'key0': 'Sprache wechseln zu',
          'key1': 'Was ist gut?',
          'key2': '{{what}} ist gut.',
          'key3WithCount': '{{count}} Gegenstand',
          'key3WithCount_plural': '{{count}} Gegenstände',
          'key4': 'Die ausgewählte Sprache ist:'
        }
      }
    },
    lng : 'en' //specify the language to use as base; used for Price, number, and Date formats
  });

HandlebarsI18n.init();

HandlebarsI18n.configure([
  // generic configuration for all languages for number representation:
  ['all', 'NumberFormat', { minimumFractionDigits: 2 }],
  // generic configurations per language for price representation:
  ['en', 'PriceFormat', { currency: 'USD'}],
  ['de', 'PriceFormat', { currency: 'EUR'}],
  // generic configurations per language for date representation:
  ['en', 'DateTimeFormat', { year:'numeric', month:'long', day:'numeric', hour:'numeric', minute:'numeric'}],
  ['de', 'DateTimeFormat', { year:'numeric', month:'numeric', day:'numeric', hour:'numeric', minute:'numeric', hour12:false}],
  // configurations per language with custom formats for date:
  ['en', 'DateTimeFormat', { year:'numeric' }, 'custom-year-only'],
  ['de', 'DateTimeFormat', { year:'numeric' }, 'custom-year-only'],
  ['en', 'DateTimeFormat', { year:'numeric', month:'numeric', day:'numeric' }, 'custom-date-short'],
  ['de', 'DateTimeFormat', { year:'numeric', month:'numeric', day:'numeric' }, 'custom-date-short'],
  ['en', 'DateTimeFormat', { hour:'numeric', minute:'numeric', second:'numeric', hour12:false}, 'custom-time'],
  ['de', 'DateTimeFormat', { hour:'numeric', minute:'numeric', second:'numeric', hour12:false}, 'custom-time']
]);

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

function callAPIbatch(finishedAPI, ticker) {
        request('https://cloud.iexapis.com/stable/stock/'+ticker+'/quote?token=pk_217be3b5db4a4cb8bf400fd4ab1348f5',{json: true},(err, res, body) =>{
            if(err){return console.log(err)};
            if(res.statusCode === 200) {
                console.log(finishedAPI(body));
                finishedAPI(body);
            };
        });
}



// set handle bars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
// app.use(bodyParser.urlencoded({
//   extended: false
// }));

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

// // Set handlebar index GET routes for batch operation
// app.get('/', function (req, res) {
//     callAPIbatch(function(doneAPIbatch) {
//             res.render('home', {
//             stock: doneAPIbatch,
//         });
//     }, "fb")
// }); 
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
