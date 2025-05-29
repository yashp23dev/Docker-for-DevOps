const express = require('express');
const mongoose = require('mongoose');
const { exec } = require('child_process')
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = 3000

mongoose.connect('mongodb://mongo:27017/mydatabase',{ useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const startContainersLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 2,
    message: 'Too many attempts to start containers. Try again later ...!!',
    standardHeaders: true,
    legacyheaders: false,
});

const checkContainersLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: 'To many checks in a short time. Please slow down....#',
    standardHeaders: true,
    legacyHeaders: false,
});

const startContainers = () => {

   exec('docker-compose up -d', (error, stdout, stderr) => {
     if(error){
       console.error(`Error starting containers: ${error.message}`);
       return;
     }
     console.log(`Containers started successfully:\n${stdout}`);
   
   });
};



//Express route to start containers 
app.get('/start-containers', startContainersLimiter, (req, res) => {
    
    startContainers();
    res.send('Containers are starting...');

});


//Express route to check if containers are running
app.get('/check-containers', checkContainersLimiter, (req, res) => {
   exec('docker ps', (error, stdout, stderr) => {
     if(error){
       console.error(`Error checking containers: ${error.message}`);
       res.send('Error checking containers');
       return;
     }
     res.send(`Containers running:\n${stdout}`);
   });
});


//Start the Express server
app.listen(PORT, () => {
   console.log(`Server is running on http//localhost:${PORT}`);
});
