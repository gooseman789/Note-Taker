// Import Express.js
const express = require('express');
const fs = require('fs')
// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require('path');
const uuid = require('./helpers/uuid')

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
      const newNotes = {
        ...req.body,
        id: uuid()
      }
      parsedData.push(newNotes);
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

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const parsedDelete = JSON.parse(data);
      const result = parsedDelete.filter((note) => {
        return note.id !== req.params.id
      })
      fs.writeFile('./db/db.json', JSON.stringify(result, null, 2), 'utf8', (err) => {
        if (err) {
          console.error(err)
          res.status(400).json({success: false})
        } else {
          console.log("Data has been removed from the file")
          res.status(200).json({success: true})
        }
      })
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
