const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.ATLAS_URI || 'mongodb://localhost/book-search',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

module.exports = mongoose.connection;
