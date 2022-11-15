const studentModel=require("../model/studentModel")
const jwt=require('jsonwebtoken')
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}



const CreateStudent = async function (req, res) {
    try {
        let user = req.body
        let { id, name, email, phone_no, country,country_code} = user

        if (!isValidRequestBody(user)) {
            return res.status(400).send({ status: false, msg: "enter data in user body" })
        }
        if (!isValid(id)) {
            return res.status(400).send({status: false, msg: "Enter Id " })
        }
            
        if (!isValid(name)) {
            return res.status(400).send({status: false,  msg: "Enter Valid Name " })
        }
        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "Enter email " })
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` })
            
        }
        const isemail = await studentModel.findOne({ email })
        if (isemail) {
            return res.status(400).send({status: false, msg: "Email.  is already used" })
        }

        if (!isValid(phone_no)) {
            return res.status(400).send({status: false, msg: "Enter phone no. " })
        }

        if (!(/^[6-9]\d{9}$/.test(phone_no))) {
            return res.status(400).send({ status: false, message: `Phone number should be a valid number` })

        }
        
        const isphone = await studentModel.findOne({ phone_no })
        if (isphone) {
            return res.status(400).send({status: false, msg: "Phone no.  is already used" })
        }
        if (!isValid(country)) {
            return res.status(400).send({status: false,  msg: "Enter Valid Country Name " })
        }
        if(!/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/.test(country)) {
            return res.status(400).send({ status: false, message: "Please enter valid country name." })
        }
        if (!isValid(country_code)) {
            res.status(400).send({ status: false, message: "country Code is required" })
            return
        }

        //this will validate the type of country code including alphabet or not.
        if (!/^\+?\d+$/.test(country_code)) {
            return res.status(400).send({ status: false, message: "Please enter valid country code." })
        }
     

        
         
        
        const NewUsers = await studentModel.create(user)
        return res.status(201).send({ Status: true, msg: "Data sucessfully Created", data: NewUsers })

    }
    catch (error) {
        return res.status(500).send(error.message)
    }
}
// //////////////////////////////////////////////////////////////////////////////
  
const userLogin = async function(req,res){
    try {
       const requestBody= req.body;
       if(!isValidRequestBody(requestBody)){
           res.status(400).send({status:false, message:'Invalid request parameters, Please provide login details'})
           return
       }

       //Extract params
       const {email,phone_no} = requestBody;

       //validation starts
       if(!isValid(email)){
           res.status(400).send({status:false, message:`Email is required`})
           return
       }
       
       if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
           res.status(400).send({status:false, message: `Emaiul should be a valid email address`})
           return
       }

       if(!isValid(phone_no)){
           res.status(400).send({status:false, message: `Phone is required`})
           return
       }
       //validation ends

       const user = await userModel.findOne({email,phone_no});

       if(!user){
           res.status(400).send({status:false, message:`Invalid login credentials`});
           return
       }

       const token = jwt.sign({
           userId: user._id.toString(),
           batch: "uranium",
           organisation: 'FunctionUp',
            iat: new Date().getTime() /1000 
       },"My private key" ,{expiresIn:"6400m"}
           
       );

       res.header('x-api-key',token);
       res.status(200).send({status:true, message:`User login successfully`, data:{token}});

   } catch (error) {
       res.status(500).send({status:false, message:error.message});
   }
}
const getStudentdetail = async function (req, res) {

    try {

        let data = req.query;
        let filter = { $and: [{ isDeleted: false,  ...data }] };
        
        if (!(data)) res.status(400).send({ status: false, msg: "please enter your data using query" })
        let studentarethere = await studentModel.find(filter)
        if (studentarethere.length === 0) {
            res.status(404).send({ status: false,msg: " the query does not match with any student are there" })
        } else {
            res.status(200).send({ status: true, data: studentarethere })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}


module.exports= {CreateStudent,userLogin ,getStudentdetail,isValid,isValidRequestBody}
