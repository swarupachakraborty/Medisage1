const jwt = require("jsonwebtoken");

const authentication = (token)=>{
    let tokenValidation = jwt.verify(token,"My private key",(err,data)=>{
        if(err) 
        return null
        else{
            return data
        }    
    })
    return tokenValidation
}


const validateToken = async function (req, res, next) {
    try {
        let token = req.headers['x-Api-Key'] || req.headers['x-api-key']
        if (!token) {
           return res.status(401).send({ status: false, message: "token should be present" });
        }
       let decodedToken = authentication(token)
       if(!decodedToken){
           return res.status(401).send({status:false,message:"inavlid token"})
       }
        console.log(decodedToken)
        
            req["id"]= decodedToken.id
             
            next()
          
    } 
    catch (err) {
        return res.status(500).send({  status:"Error", error: err.message })

    }
}
module.exports.validateToken = validateToken
