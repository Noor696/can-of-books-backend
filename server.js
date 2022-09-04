'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

// mongoose config ('mongodb://localhost:27017/test')
mongoose.connect('mongodb://localhost:27017/Book', {useNewUrlParser: true, useUnifiedTopology: true}); // 1 - connect mongoose with DB

const BooksSchema = new mongoose.Schema({  //2- define the Schema (object structure)
  title: String,
  description: String,
  status: String,
});

const BookModel = mongoose.model('Books', BooksSchema); // 3- compile the schema into the model

//seed data (insert initial data)
async function seedData(){
  const firstbook = new BookModel({
    title: "Oliver Twist",
    description: "Charles Dickens's second novel, was published as a serial from 1837 to 1839,",
    status: "English Language,Available",
  })
  const secondbook = new BookModel({
    title: "The Merchant of Venice",
    description: "The Merchant of Venice is a 16th-century play written by William Shakespeare in which a merchant in Venice named Antonio defaults on a large loan provided by a Jewish moneylender, Shylock. It is believed to have been written between 1596 and 1599.",
    status: "English Language,Available",
  })
  const thirdbook = new BookModel({
    title: "Les Misérables",
    description: "The experience of reading Les Miserables is akin to that of any lengthy novel. For hundreds of pages you will be hooked, dazzled, unable to put it down.",
    status: "English Language,Available",
  })
  const fourthbook = new BookModel({
    title: "Jane Eyre",
    description: " is a novel by the English writer Charlotte Brontë",
    status: "English Language,Available",
  })

  await firstbook.save();
  await secondbook.save();
  await thirdbook.save();
  await fourthbook.save();
}

// seedData(); //call seedData function

// Routes
app.get('/',homeHandler);
app.get('/books', booksRouteHandler)
app.get('/test',testHandler);
app.get('*',defualtHandler);

// http://localhost:3010/
function homeHandler(request,response){
  res.send("Hi from the home route");
}

function booksRouteHandler(request,response){
  BookModel.find({},(err,result) =>{
    if(err){
      console.log(err)
    }
    else 
    {
      res.send(result)
    }
  })
}

// http://localhost:3010/test
function testHandler(request,response){
  res.status(200).send("you are request the test route");
}

// http://localhost:3010/*
function defualtHandler(req,res){
  res.status(404).send("sory,404 page not found");
}


app.listen(PORT, () => console.log(`listening on ${PORT}`));
