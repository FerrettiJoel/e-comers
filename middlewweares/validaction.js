 var blanca_rossi = require("../models/blanca-rossi.js"),
    validator = require("validator"),
    passwordValidator = require("password-validator");

    var schema = new passwordValidator();

    schema
        .is().min(8)
        .is().max(72)
        .has().not().spaces()

        module.exports.validation = async (req, res, next) =>{
            var message = await formvalidation(req.body)

            if(message != true){
                res.render('login' )
            }else{
                next()
            }
        }

        const formvalidation = async (data)=>{
            const {usuario_name, user_email, user_password, confirmPassword}= data;
            
            if(validator.isEmpty(usuario_name) || validator.isEmpty(user_email) || validator.isEmpty(user_password) || validator.isEmpty(confirmPassword) ) {
                return 'Empty fields not allowed'
            }

            if(!validator.isEmail){
                return 'Email format is not valid';
            }

            if (!schema.validate(user_password)){
                return 'Invalid password'
            }

            if(user_password !== confirmPassword){
                return "Password are not machine"
            }

            if(validator.contains(user_password.toLowerCase(), "password")){
                return 'invalid password';
            }

            return true;
            
        }