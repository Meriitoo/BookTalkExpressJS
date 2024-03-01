const Book = require('../models/Book');
const User = require('../models/User');

exports.getAll = () => Book.find({}).lean(); //from documents to objects

exports.create = async (ownerId, bookData) => {
    const createdBook = await Book.create({ ...bookData, owner: ownerId });

    await User.findByIdAndUpdate(ownerId, {$push : {createdBook: createdBook._id}});

    return createdBook;
}

exports.getOne = (bookId) => Book.findById(bookId).lean();

exports.findOwner = (userId) => User.findById(userId);

exports.wishToReadFunc = async (userId, bookId) => {
    const book = await Book.findById(bookId); 
    const user = await User.findById(userId);
    //Todo: if user already sign in the course
    book.wishingLis.push(userId);
    user.wishedUpBooks.push(bookId);

    await book.save();
    await user.save();

    // await Course.findByIdAndUpdate(courseId, { $push: { signUpList: userId }}); 
};

exports.getOne = (bookId) => Book.findById(bookId).lean();

exports.edit = (bookId, bookData) => Book.findByIdAndUpdate(bookId, bookData, { runValidators: true });

exports.delete = (bookId) => Book.findByIdAndDelete(bookId);