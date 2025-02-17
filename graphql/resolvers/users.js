const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server-express');
const nodemailer = require("nodemailer");
require('dotenv').config()

const {
  validateRegisterInput,
  validateLoginInput
} = require('../../utils/validators');
const User = require('../models/User');
const Profile = require('../models/Profile');


function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    process.env.SECRET_KEY || "",
    {expiresIn: "12h"}
  );
}
function generateAuthorization(user){
  return jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    process.env.SECRET_KEY || "",
    {expiresIn: "1h"}
  );
}

module.exports = {

  Mutation: {

    ///////////login////////////////

    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }
      

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }
      if (!user.status) {
        errors.general = 'Please activate your account';
        throw new UserInputError('Please activate your account', { errors });
      }
      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },


    /////////////Register//////////

    async register(
      _,
      {
        registerInput: { username, email, password, confirmPassword }
      }
    ) {
      try {
        console.log("registering user \n")
        // Validate user data
        const { valid, errors } = validateRegisterInput(
          username,
          email,
          password,
          confirmPassword
        );
        if (!valid) {
          console.log("errors : ", errors)
          throw new UserInputError('Errors', errors );
        }
        const user = await User.findOne({ username });
        if (user) {
          console.log("username is taken")
          throw new UserInputError('Username is taken', {
            errors: {
              username: 'This username is taken'
            }
          });
        }
        const userEmail = await User.findOne({ email });
        if (userEmail) {
          console.log("email is already registered with us")
          throw new UserInputError('Email is already registered with us', {
            errors: {
              email: 'This email is already registered with us'
            }
          });
        }
  
        password = await bcrypt.hash(password, 12);
  
        const newUser = new User({
          email,
          username,
          password,
          status: false,
          createdAt: new Date().toISOString()
        });
        const newProfile = new Profile({
          username,
          title: "My Food Truck",
          description: "Tell the world how awesome your food is!!"
  
        })
        console.log("saving user and profile")
        await newProfile.save();
        const res = await newUser.save();
        console.log("generating token")
        const token = generateToken(res);
        console.log("generating authorization")
        const authorization = generateAuthorization(res)
        const mailOptions = {
          from: process.env.EMAIL_USER, // sender address
          to: email, // list of receivers
          subject: "Please confirm your Find Food Truck account", // Subject line
          html: `<div>
          <h1>Email Confirmation</h1>
          <h2>To activate your account, <a href="${process.env.APP_URL}/authenticate/${authorization}">click here</a><h3>`, // plain text body
        };
        console.log("sending mail : ", mailOptions, process.env.NODEMAILER_USER, process.env.NODEMAILER_PASS);

		    const transport = nodemailer.createTransport({
		    	service: "gmail",
		    	auth: {
		    		user: process.env.NODEMAILER_USER,
		    		pass: process.env.NODEMAILER_PASS,
		    	},
		    });
        const mailInfo = await transport.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log("mail sending error : ",err);
            throw new Error("Error in sending confirmation email")
          }
          console.log("mail sending info : ", info);
         
        });
        console.log("mail sent info : ", mailInfo);
        const response = {
          ...res._doc,
          id: res._id,
          token
        }
                console.log("returning user", response);
        return response;
      } catch (err) {
        console.log(err, '\n', "stringified error : ", JSON.stringify(err))
        throw new Error(err)
      }

    },
    ///////////Authorize User ///////////////

    async authenticateUser( _, {token}){
        if (token) { 
          try {
            const decode = await jwt.verify(token, process.env.SECRET_KEY);
            const username= decode.username
            const user = await User.findOne({username})
            if(user){
              user.status = true;
              await user.save()
              return true
            }
          } catch (err) {
            throw new Error("Expired Token")
          }
        } else { throw new Error("Valid authentication token must be provided") }
      }
    
    }
};
