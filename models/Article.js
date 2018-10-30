var mongoose = require("mongoose");

//  save reference to the Schema constructor 
var Schema = mongoose.Schema;

// use the Schema constructor, create a new UserSchema object
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// this creates our model from the above schema
var Article = mongoose.model("Article", ArticleSchema);

// export the Article model
module.exports = Article;