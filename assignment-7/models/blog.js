const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    heading:{ type:String , required :true},
    blog:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true}
});
blogSchema.plugin(uniqueValidator);


module.exports = mongoose.model('Blog' , blogSchema)