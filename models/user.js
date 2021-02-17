const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

//adds on username and password fields to schema
//I believe this allows Passport code to take over on the handling
//of usernames and passwords
UserSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model('User', UserSchema);