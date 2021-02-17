const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');
const review = require('../models/review');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//error handling in connecting to DB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
})

//array[Math.floor(Math.random() * array.length)] --> pick a random entry from an array

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
    await Campground.deleteMany({});
    await review.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const randNum = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //ADMIN USER ID - branon
            author: '6008748608513c23a5997394',
            location: `${cities[randNum].city}, ${cities[randNum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [ 
                {
                url: 'https://res.cloudinary.com/dcrwbq6me/image/upload/v1611705229/YelpCamp/pqlqrs0l78lqea58pxwp.jpg',
                filename: 'YelpCamp/pqlqrs0l78lqea58pxwp'
                },
                {
                url: 'https://res.cloudinary.com/dcrwbq6me/image/upload/v1611705231/YelpCamp/lqoogecu7eysq1t1ingx.jpg',
                filename: 'YelpCamp/lqoogecu7eysq1t1ingx'
                },
                {
                url: 'https://res.cloudinary.com/dcrwbq6me/image/upload/v1611708273/YelpCamp/nvt853fjbpknw0v0v8pq.jpg',
                filename: 'YelpCamp/nvt853fjbpknw0v0v8pq'
                }
            ],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ante neque, dapibus nec ligula non, dapibus volutpat ligula. Mauris eu tristique lacus. Morbi volutpat risus ac tellus accumsan, vitae rutrum sapien vehicula.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[randNum].longitude,
                    cities[randNum].latitude,
                ]
            }
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})