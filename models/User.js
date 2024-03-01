const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required!'],
        minLength: 10,
    },
    username: {
        type: String,
        required: [true, 'Username is required!'],
        minLength: 4,
    },
    password: {
        type: String, 
        required: [true, 'Password is required!'],
        minLength: 3,
    },
    createdBook: [{
        type: mongoose.Types.ObjectId,
        ref: 'Book',
    }],
    wishedUpBooks: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;

// {
//     virtuals: {
//         repeatPassword: {
//             set(value) {
//                 if (this.password !== value) {
//                     throw new mongoose.Error('Password missmatch');
//                 }
//             }
//         }
//     }
// }
