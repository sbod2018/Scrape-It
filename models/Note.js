var mongoose = require("mongoose");

// save a reference to the Schema constructor
var Schema = mongoose.Schema;

// using the Schema constuctor, create a new NoteSchema object
var NoteSchema = new Schema({
    title: String,
    body: String
});

// this create our model from above schema, using mongoose's model method
var Note =mongoose.model("Note", NoteSchema);

// export Note model
module.exports = Note;