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