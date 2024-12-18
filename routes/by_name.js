const express = require('express');
const router = express.Router();
const path = require('path');
const Pioneer = require('../models/pioneer'); // assuming the models directory is at the root level
const _ = require('lodash');

router
  .route('/')
  .get((req, res) => {
    res.render(path.join(__dirname, '../views/by_name.ejs'));
    console.log('By Name Page has been requested');
  })
  .post((req, res) => {
    // Capture the button press and log it to the console
    let alphabet = '';
    for (let key in req.body) {
      console.log(`Button ${key} was pressed.`);
      alphabet = key;
    }
    // Send the alphabet to as a parameter to the search function
    res.redirect('/by_name_search/' + alphabet);
  });

module.exports = router;
