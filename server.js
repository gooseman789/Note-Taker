// Import Express.js
const express = require('express');
const fs = require('fs')
// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require('path');

// Initialize an instance of Express.js
const app = express();

// Specify on which port the Express.js server will run
const PORT = process.env.PORT || 3001;

// Static middleware pointing to the public folder
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Create Express.js routes for default '/', '/send' and '/routes' endpoints

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './db/db.json'))
);

app.post('/api/notes', (req, res) => {
  console.log(req.body)
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(req.body);
      fs.writeFile('./db/db.json', JSON.stringify(parsedData, null, 2), 'utf8', (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Data has been appended to the file')
          res.json({success: true})
        }
      });
    }
  })
})
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
