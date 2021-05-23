// Stock Market App to lookup stock quotes

const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const path = require('path');
const request = require('request');

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

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
var marketCap = formatter.format(2500);

// Set handlebar routes
app.get('/', function (req, res) {
    callAPI(function(doneAPI) {
            res.render('home', {
            stock: doneAPI,
        });
    }, "fb"), 
    marketCap;

        
});    



// About page
app.get('/about.html', function (req, res) {
    res.render('about');
});


// Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log("Server listening on port "+ PORT));

