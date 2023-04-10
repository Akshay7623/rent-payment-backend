const fetch = require('node-fetch');
const axios = require('axios');
const {otpModel} = require('../model/signupModel');
const resetOtp = async(req,res,next)=>{
    
    const mobile = req.mobile;
    const result = await otpModel.findOne({mobile: mobile});
    if (result) {
      const date = new Date().toString();
      const newOtp = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000).toString();
      const Updated = await otpModel.updateOne({mobile:mobile},{otp:newOtp,otpCreatedAt:date});
      await axios.get(`https://2factor.in/API/V1/65798c8f-db85-11ea-9fa5-0200cd936042/SMS/${mobile}/${newOtp}/FIEPAY`);
      res.json({message:"OTP_SENT",mobile:mobile});
    }else{
      res.json({message:"INVALID"});
    }

    

};

module.exports={resetOtp};