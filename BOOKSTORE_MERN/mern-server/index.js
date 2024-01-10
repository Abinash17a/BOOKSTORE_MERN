const express = require('express')
const app = express();
const cors =require('cors');
const { ObjectId } = require('mongodb');
const port =3100;
const myObjectId = new ObjectId();

app.use(cors());
app.use(express.json());


app.get('/',(req,res)=>{
    res.send('Hello World');
})


//mongo db config


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Abinash:PLAYER%4047A@cluster0.mpvhkgk.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const bookCollection=client.db("BookInventory").collection("books");

    //insert a book to the db

    app.post("/upload-book",async(req,res)=>{
        const data =req.body;
        const result=await bookCollection.insertOne(data);
        res.send(result);
    });

    //GET ALL BOOKS FROM DataBase

    app.get("/all-books", async (req, res) => {
      try {
        const category = req.query?.category;
    
        if (!category) {
          // If no category is provided, return all books
          const allBooks = await bookCollection.find({}).toArray();
          res.send(allBooks);
        } else {
          // If a category is provided, filter by category
          const result = await bookCollection.find({ category }).toArray();
          res.send(result);
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });

    //update a book data patch or update

    app.patch("/book/:id",async(req,res)=>{
      const id=req.params.id;
      // console.log(id);
      const updateBookData=req.body;
      const filter ={ _id: new ObjectId(id) };
      const options = {upsert:true};
      const updateDoc= {
        $set:{
          ...updateBookData
        }
      }
      //update
      const result=await bookCollection.updateOne(filter,updateDoc,options);
      res.send(result);

    })

    //delete from db

    app.delete("/delete",async(req,res)=>{
      const id=req.params.id;
      const filter={ _id:new ObjectId(id) };
      const result=await bookCollection.deleteOne(filter);
      res.send(result);

    })

    //single book data
    app.get("/book/:id",async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)};
      const result=await bookCollection.findOne(filter);
      res.send(result);
    })

  
    


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
})