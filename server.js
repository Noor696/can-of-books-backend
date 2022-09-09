'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
//access request.body: if you need to use the body on code you need to add new line on server.js to allow you to fetch and see the data on the body
app.use(express.json());
app.use(cors()); //make my server open for any request

const PORT = process.env.PORT || 3005;
const linkdb =process.env.linkDB;

// mongoose config ('mongodb://localhost:27017/test')
//mongoose.connect('mongodb://localhost:27017/Book', {useNewUrlParser: true, useUnifiedTopology: true}); // 1 - connect mongoose with DB

mongoose.connect(`${linkdb}`, {useNewUrlParser: true, useUnifiedTopology: true}); // 1 - connect mongoose with DB


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
    description: "English Language,Available, Charles Dickens's second novel, was published as a serial from 1837 to 1839,",
    status: "Novel",
  })
  const secondbook = new BookModel({
    title: "The Merchant of Venice",
    description: "English Language,Available,The Merchant of Venice is a 16th-century play written by William Shakespeare in which a merchant in Venice named Antonio defaults on a large loan provided by a Jewish moneylender, Shylock. It is believed to have been written between 1596 and 1599.",
    status: "Novel",
  })
  const thirdbook = new BookModel({
    title: "Les Misérables",
    description: "English Language,Available,The experience of reading Les Miserables is akin to that of any lengthy novel. For hundreds of pages you will be hooked, dazzled, unable to put it down.",
    status: "Novel",
  })
  const fourthbook = new BookModel({
    title: "Jane Eyre",
    description: "English Language,Available, is a novel by the English writer Charlotte Brontë",
    status: "Novel",
  })

  await firstbook.save();
  await secondbook.save();
  await thirdbook.save();
  await fourthbook.save();
}

//seedData(); //call seedData function

// Routes
app.get('/',homeHandler);
app.get('/books', booksRouteHandler)
app.get('/test',testHandler);
app.post('/books',addBookHandler); //this route allow the user to add the book, you shuld match method and route to do handler
app.delete('/books/:id',deleteBookHandler); 
app.put('/books/:id',updateBookHandler);
app.get('*',defualtHandler);

// http://localhost:3005/
function homeHandler(request,response){
  response.send("Hi from the home route");
}

// http://localhost:3005/test
function testHandler(request,response){
  response.status(200).send("you are request the test route");
}

// this route responsable to add the book data inside the data base(Book) inside the collection (Books)
// use (create) when post method [post =>create ] to create the data into the database
// create method it will take the time , we need to force it to await and async
// should put the create(post) method before find(get) and send the data as the response
async function addBookHandler(request,response){
  //console.log(request.body);  //if the method (post) you can access the data request.body
  const {title,description,status} = request.body; //Destructuring assignment
  await BookModel.create({
    title: title,
    description: description,
    status: status,
  });
  BookModel.find({},(err,result)=>{
    if(err)
    {
        console.log(err);
    }
    else
    {  
        // console.log(result);
        response.send(result);
    }
})

}

// http://localhost:3005/books  
// use (find) when get the method [get =>find ]
//if the method (get) you can access the data request.query
function booksRouteHandler(request,response){
  BookModel.find({},(err,result) =>{
    if(err){
      console.log(err);
    }
    else 
    {
      // console.log(result);
      response.json(result);
    }
  })
}

function deleteBookHandler(request,response) { 
  const bookId = request.params.id;                // use param if you want to get specific section from the url [(id => '/books/:id') === (noor => '/books/:noor') means use any name
  BookModel.deleteOne({_id:bookId},(err,result)=>{
      
      BookModel.find({},(err,result)=>{ 
          if(err)
          {
              console.log(err);
          }
          else
          {
              // console.log(result);
              response.send(result);
          }
      })
  }) 
}

async function updateBookHandler (request,response) {
  const id = request.params.id;
  const {title,description,status} = request.body; //Destructuring assignment
  BookModel.findByIdAndUpdate(id,{title,description,status},(err,result)=>{
    if (err){
      console.log(err);
    }
    else {
      BookModel.find({},((err,result)=>{
        if (err){
          console.log(err);
        }
        else {
          response.send(result);
        }
      }))
    }
  })
}



// http://localhost:3005/*
function defualtHandler(request,response){
  response.status(404).send("sory,404 page not found");
}



app.listen(PORT, () => console.log(`listening on ${PORT}`));
