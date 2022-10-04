const express= require('express')
const bodyParser= require('body-parser')
const app= express()
const MongoClient= require('mongodb').MongoClient

require('./dotenv')
const connectionString = process.env.DB_URL




MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db= client.db('star-wars-quotes')
    //create a quotes collection in mongodb
    const quotesCollection= db.collection('quotes')

    //set the view engine to ejs to render the html, needs to be placed before any .use .get .post requests
    app.set('view engine', 'ejs')

    //tell express to make public folder accessible
    app.use(express.static('public'))

    //to enable our server to accept JSON need to use body-parsers json middleware
    app.use(bodyParser.json())

    //put all put our express request handlers into the MongoClient’s then call because we need our const db var to be able to access our db

 //need to use bodyparser middleware before CRUD requests in order to be able to get form data
//the urlenconded method within body parser tells body parser to extract data from the form element
//and add them to the body property in the request obj
//you can now see values from the form element inside req.body
app.use(bodyParser.urlencoded({extended: true}))



//GET
//we get the quotes we stored in our db with the mongodb find method (thats available on the collection method)
//we then use toArray() to convert what our db returned so users can see it
app.get('/', (req, res) => {
    db.collection('quotes').find().toArray()
        .then(results => {
            console.log(results)
            res.render('index.ejs', {quotes: results})
        })
        //our catch our block
        .catch(error => console.log(error))
  })


  //POST
  //post request (create) getting input from my form in index.html
  // '/quote' is the action on the form

  //add data inputed in the form to the quotes collection using insertOne (mongodb method)
  //since the server isnt sending anything back; (post is only adding the quote to our server)
  //we need to ask the browser to redirect back to / using res.redirect
  app.post('/quotes', (req, res) => {
    quotesCollection.insertOne(req.body)
      .then(result => {
        res.redirect('/')
      })
      .catch(error => console.error(error))
  })



  //PUT    using mongos findOneAndUpdate method to find and change quote in the bd
  
    //findOneAndUpdate //filter by the key value pairs name: Yoda //use the $set operator from mongo to update it and change to darth vader quotes
    //define additional options for this req, if no yoda quote exist in the db force mongodb to create a new darth vader quote (by setting upset to true)
   //upsert means: insert a document if no documents can be updated
 //need to respond to the JS that sent the PUT req, here we're resp by sending the successs mess
 app.put('/quotes', (req, res) => {
    quotesCollection.findOneAndUpdate(
      { name: 'Yoda' },
      {
        $set: {
          name: req.body.name,
          quote: req.body.quote
        }
      },
      {
        upsert: true
      }
    )
      .then(result => res.json('Success'))
      .catch(error => console.error(error))
  })
  
      

      //DELETE route  using mongos method deleteOne( query, options) wont need options for this

      app.delete('/quotes', (req, res) => {
        //query req.body.name (in this case gives us darth vader)
        quotesCollection.deleteOne(
        {name: req.body.name}
        )
        .then(result => {
            //conditional if there's no darthvader quotes to delete
            if(result.deletedCount === 0){
                return res.json('No quote to delete')
            }
            res.json('Deleted Darth Vader\'s quote')
        })
        .catch(error => console.error(error))
      })



app.listen(3000, function(){
    console.log("listening on port 3000")
})


  })
  .catch(error => console.error(error))

