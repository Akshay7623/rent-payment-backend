const fetch = require('node-fetch');
const axios = require('axios');
const {otpModel } = require('../model/signupModel');

const resendOtp = async(req,res,next)=>{
    
     const data =  await otpModel.findOne({mobile:req.body.mobile});
     if (data) {
         //then user have tried to send otp once atleast
         const currDate = new Date();
         const oldDate = new Date(data.otpCreatedAt);
         const minutes = parseInt(Math.abs(oldDate.getTime() - currDate.getTime()) / (1000 * 60) % 60);
        
         if (minutes>5) {
            res.json({message:"SESSION_EXPIRED",auth:false});
            return;
         }
         
        if (minutes>0) {
         const date = new Date().toString();
         const newOtp = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
         const updated = await otpModel.updateOne({mobile:req.body.mobile},{otpCreatedAt:date,otp:newOtp,otpCount:0});

         if (updated.modifiedCount) {
            await axios.get(`https://2factor.in/API/V1/65798c8f-db85-11ea-9fa5-0200cd936042/SMS/${mobile}/${newOtp}/FIEPAY`);
            res.json({message:"OTP_UPDATED",auth:true});
        }else{
             res.json({message:"ERROR",auth:false});
         }
        }else{
            res.json({message:"TIME_ERROR",auth:false});
        }


     }else{
         res.json({message:"USER_ERROR",auth:false})
     }
}


module.exports = {resendOtp};