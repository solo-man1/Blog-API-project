const mongoose=require('mongoose');
const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Title is required'],
        trim:true,
        minlength:3,
        maxlength:100
    },
    content:{
        type:String,
        required:[true,'Content is required'],
        minlength:10
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    tags:{
        type:[String],
        default:[]
    }
},{timestamps:true});
module.exports=mongoose.model('Blog',blogSchema);