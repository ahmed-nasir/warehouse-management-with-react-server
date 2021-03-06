const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000

const app = express();

//middleware
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y47ea.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const itemsCollection = client.db('warehouseDB').collection('Items')

        app.get('/item', async (req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        app.get('/limitItem', async (req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query).limit(6);
            const items = await cursor.toArray();
            res.send(items);
        })

        // single item
        app.get('/limitItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemsCollection.findOne(query);
            res.send(item);
        })
        // My item
        app.get('/myItem', async (req, res) => {
            const email = req.query.email;
            console.log(email)
            const query = { email: email };
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })
        app.post('/addItem', async (req, res) => {
            const newItem = req.body;
            const result = itemsCollection.insertOne(newItem);
            res.send(result);
        })

        // update quntity
        app.put('/updateQuntity/:id', async (req, res) => {
            const id = req.params
            const data = req.body
            const newQuantity = data.quantity
            
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: newQuantity,
                },
            };
            const result = await itemsCollection.updateOne(filter,updateDoc,options);
            res.send(result)

        })

        // Delete
        app.delete('/item/:id', async (req, res) => {

            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await itemsCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }

}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Running servier');
})

app.listen(port, () => {
    console.log('lisatningto port', port)
})