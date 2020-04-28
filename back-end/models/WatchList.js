const mongoose = require('mongoose');

const watchListSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    movies: {
        required: false,
        type: Array
    }
});

module.exports = WatchList = mongoose.model("WatchList", watchListSchema);