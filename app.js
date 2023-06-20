const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const dotenv = require('dotenv');
const ejs = require('ejs');
const path = require('path');
const cors = require('cors');
const connectDb = require('./config/db');
const session = require('express-session');
const upload = require('express-fileupload');
const methodOverride = require('method-override');

dotenv.config();


connectDb();

if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, '/public')));
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

app.use(upload());
app.use(methodOverride('_method'));

app.use(session({
    resave: true,
    secret: 'keyboard',
    saveUninitialized: true
}));


app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  res.locals.errors = req.flash('errors')
  next();
});

app.use('/', require('./routes/home/index'));
app.use('/admin/pages', require('./routes/admin/pages'));
app.use('/admin/categories', require('./routes/admin/categories'))
app.use('/admin/products', require('./routes/admin/products'));

app.listen(port, () =>{ 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port} !`)
})