const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
   id:{type:String,required:true}, 
  name: {type:String, required:true},
  email: {
    type: String, trim: true, lowercase: true, unique: true, required: 'Email address is required',
    validate: {
        validator: function (email) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
        }, message: 'Please fill a valid email address', isAsync: false
    }
},
phone_number: {
    trim: true,
    type: String,
    required: 'student mobile is required',
    unique: true,
    validate: {
        validator: function (phone) {
            return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)
        }, message: 'Please fill a valid mobile number', isAsync: false
    }
},
  country: {type:String, required:true},
  country_code:{type:String,required:true},
  
},{timestamps:true})

module.exports = mongoose.model('studentdatas', studentSchema)
