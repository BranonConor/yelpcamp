const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    location: String,
    //get the objectid of the reviews model
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);
CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<a href='/campgrounds/${this._id}'>${this.title}</a>
        <p>${this.description.substring(0, 20)}</p>
    `;
})
//this is a query middelware function in Mongoose, which passes on the document that was deleted
//this middleware is triggered by the findOneAndDelete function only, changing that will not trigger this
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        //If a review was present under this Campground that was deleted,
        //go find the same reviews by ID and remove them from the Reviews collection too
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);