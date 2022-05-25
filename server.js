const express = require('express')
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

// Link to Database - This is a mongodb stored in my Atlas
MongoClient.connect('mongodb+srv://brener:brener1908@api-crud.mtlvt.mongodb.net/?retryWrites=true&w=majority', 
    { useUnifiedTopology: true })    
    .then(client => {        
        console.log('Connected to Database')
        const db = client.db('api-crud') 
        //creating the collection 'quotes'to store the poets quotes in the database
        const quotesCollection = db.collection('quotes')  

        //Middleware
        app.set('view engine', 'ejs') 
        app.use(bodyParser.urlencoded({ extended: true }))
        //teaching the server to read JSON
        app.use(bodyParser.json())
        app.use(express.static('public'))
        
        // Routes
        app.get('/', (req, res) => {
          /*getting quotes stored in MongoDB with the find() method 
          and using toArray() method to convert the data into an array*/
          db.collection('quotes').find().toArray()
            .then(quotes => {
              //rendering the HTML
              res.render('index.ejs', { quotes: quotes })
            })
            .catch(error => console.error(error))
        })  
       
        app.post('/quotes', (req, res) => {
          //using the insertOne() method to add items into a MongoDB 'quotes' collection
          quotesCollection.insertOne(req.body)
            .then(result => {
              res.redirect('/')
            })
            .catch(error => console.error(error))
        })

        app.put('/quotes', (req, res) => {
          //finding and changing one item in the database using the findOneAndUpdate() method
          quotesCollection.findOneAndUpdate(
            { name: 'Oscar Wilde' },
            {
              $set: {
                name: req.body.name,
                quote: req.body.quote
              }
            },
            {
              //inserting a document if no documents can be updated
              upsert: true
            }
          )
            .then(result => res.json('Success'))
            .catch(error => console.error(error))
        })

        app.delete('/quotes', (req, res) => {
          //removing a document from the database using deleteOne() method
          quotesCollection.deleteOne(
            { name: req.body.name }
          )
            .then(result => {
              //telling the browser that there are no more Bernard Shaw quotes to delete
              if (result.deletedCount === 0) {
                return res.json('No quote to delete')
              }
              //sending a response back to the JavaScript
              res.json('Deleted George Bernard Shaw\'s quote')
            })
            .catch(error => console.error(error))
        })

        //Checking in with port the server is listening
        const port = 3000
          app.listen(port, function () {
            console.log(`Listening on port: ${port}`)
          })
})
.catch(console.error)