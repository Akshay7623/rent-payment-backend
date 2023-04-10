const fetch = require('node-fetch');
const axios = require('axios');
const {newSignupModel, signupModel} = require('../model/signupModel');

const Signup = async (req, res, next) => {
  const UserCheck = async () => {
    const data = await signupModel.findOne({ mobile: req.body.mobile });
    if (data) {
      //user is already registered
      res.json({ auth: "useravailable" });
    } else {
      //user is not registered maybe user tried to registered but dont know
      const tried = await newSignupModel.findOne({ mobile: req.body.mobile });
      if (typeof req.body.name === 'undefined' || typeof req.body.mobile === 'undefined' || typeof req.body.password === 'undefined') {
        res.json({auth:"INVALID_DATA"});
        return;
      }
      if(req.body.mobile.length!==10){
        res.json({auth:"INVALID_DATA"});
        return;
      }
      if(req.body.password.trim().length<6){
        res.json({auth:"INVALID_DATA"});
        return;
      }
      if (tried) {
        //user tried once or more then once 100% i am sure
        await newSignupModel.deleteMany({ mobile: req.body.mobile });
        let date = new Date().getTime();
        date = Math.floor(date);
        req.body.otp = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        req.body.userCreatedAt = date;
        let user = new newSignupModel(req.body);
        let result = await user.save();
        await axios.get(`https://2factor.in/API/V1/65798c8f-db85-11ea-9fa5-0200cd936042/SMS/${req.body.mobile}/${req.body.otp}/FIEPAY`);
        result = result.toObject();
        delete result.password;
        delete result.otp;
        delete result._id;
        delete result.userCreatedAt;
        res.json(result);
        //send otp api call here we have only mobile number in resend

      } else {
        let date = new Date().getTime();
        date = Math.floor(date);
        req.body.otp = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        req.body.userCreatedAt = date;
        let user = new newSignupModel(req.body);
        let result = await user.save();
        await axios.get(`https://2factor.in/API/V1/65798c8f-db85-11ea-9fa5-0200cd936042/SMS/${req.body.mobile}/${req.body.otp}/FIEPAY`);
        result = result.toObject();
        delete result.password;
        delete result.otp;
        delete result._id;
        delete result.userCreatedAt;
        res.json(result);
        //send otp api call
        
      }
    }
  };
  UserCheck();
};

module.exports = {Signup}