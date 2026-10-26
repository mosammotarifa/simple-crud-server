const express = require("express");
const dotenv= require('dotenv')
dotenv.config()
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const uri = process.env.SIMPLE_CRUD_SERVER;
if (!uri) {
  throw new Error("failed to fetched");
}
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const run = async () => {
  try {
    await client.connect();
    const db = client.db("simplecrudserver");
    const usersCollection = db.collection("users");
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get(`/users/:id`,async (req, res) => {
        const id = req.params.id
        const query={
            _id:new ObjectId(id)
        }
        const user =await usersCollection.findOne(query)
      console.log(" ok id",id);
      res.send(user);
    });
    app.post('/users',async(req,res)=>{
      const newUsers= req.body
      const result =await usersCollection .insertOne(newUsers)
      res.send(result)
    })
    app.patch(`/users/:id`,async(req,res)=>{
      const id= req.params.id
      const filter ={_id:new ObjectId(id)}
      const modifiedUser=req.body 
      const updatedDocument = {
        $set:{
          name:modifiedUser.name,
          email:modifiedUser.email, 
          position:modifiedUser.position

        }
      }
      const result =await usersCollection .updateOne(filter,updatedDocument)
      res.send(result)
    })
    app.delete(`/users/:id`,async(req,res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId (id)}
      const result = await usersCollection.deleteOne(query)
      res.send(result)

    })
    await client.db("admin").command({ ping: 1 });
    console.log("deployment ok and pinged");
  } finally {
    // await client .close()
  }
};
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send(" ther server is rendaring");
});
app.listen(port, (req, res) => {
  console.log(` the ${port} port of  the  dont env added serving`);
});
