const User = require('../models/User');
const Book = require('../models/Book');

exports.getMyWishBook = (userId) => Book.find({ wishingLis: userId}).lean();