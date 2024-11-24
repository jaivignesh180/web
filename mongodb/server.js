const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// MongoDB connection
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let registrationsCollection;

client.connect()
    .then(() => {
        registrationsCollection = client.db('abi').collection('shek');
        console.log('Connected to MongoDB');
    })
    .catch(err => console.error('MongoDB connection failed:', err));

// API Endpoints
app.post('/api/registrations', async (req, res) => {
    try {
        const newRegistration = req.body;
        const result = await registrationsCollection.insertOne(newRegistration);
        res.status(201).json({ id: result.insertedId, ...newRegistration });
    } catch (err) {
        console.error('Error creating registration:', err);
        res.status(500).send('Error registering');
    }
});

app.get('/api/registrations', async (req, res) => {
    try {
        const registrations = await registrationsCollection.find().toArray();
        res.json(registrations);
    } catch (err) {
        console.error('Error fetching registrations:', err);
        res.status(500).send('Error fetching registrations');
    }
});

app.put('/api/registrations/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const updatedData = req.body;
        const result = await registrationsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send('Registration not found');
        }

        res.json({ id, ...updatedData });
    } catch (err) {
        console.error('Error updating registration:', err);
        res.status(500).send('Error updating registration');
    }
});

app.delete('/api/registrations/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await registrationsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).send('Registration not found');
        }

        res.json({ id });
    } catch (err) {
        console.error('Error deleting registration:', err);
        res.status(500).send('Error deleting registration');
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'info.html'));
});

// Error handling for invalid routes
app.use((req, res) => {
    res.status(404).send('Endpoint not found');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
