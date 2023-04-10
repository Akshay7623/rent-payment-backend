const { PaymentModel } = require("../model/signupModel");
const request = require("request");
const { parse } = require("dotenv");
const MarkPaid = async (req, res, next) => {
  let payload;
  const paymentId = req.body.id;

  const result = await PaymentModel.updateOne(
    { _id: paymentId },
    { isPaid: 1 }
  );
  const data = await PaymentModel.findOne({ _id: paymentId });

  
  const reqUrl = "https://api.razorpay.com/v1/payouts";
  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
    Authorization:
      "Basic cnpwX2xpdmVfT0V0cVZoZ0R1TGplNUQ6bDhEMUtoRjlnMEpSRHVidDlnWGl0QlVK",
  };

  if (!data) {
    res.json({ message: "USER_NOT_VALID" });
    return;
  }

  const amount = Math.floor(parseInt(data.amount) - ((parseInt(data.amount) * 5) / 100 + 2));

  if (data.ifsc === null || data.ifsc === '') {
    console.log("its upi transaction !");
    payload = {
      account_number: "4564563113553412",
      amount: 100 * amount,
      currency: "INR",
      mode: "UPI",
      purpose: "payout",
      fund_account: {
        account_type: "vpa",
        vpa: {
          address: data.upi,
        },
        contact: {
          name: data.name,
          email: data.email,
          contact: data.mobile,
          type: "customer",
          reference_id: data.userId,
          notes: {
            notes_key_1: "Tea, Earl Grey, Hot",
            notes_key_2: "Tea, Earl Grey… decaf.",
          },
        },
      },
      queue_if_low_balance: true,
      reference_id: data.userId,
      narration: data.purpose,
      notes: {
        userId: data.userId,
        orderId: data.orderId,
      },
    };
  } else {
    console.log("its IMPS transaction !");
    payload = {
      account_number: "4564563113553412",
      amount: 100 * amount,
      currency: "INR",
      mode: "IMPS",
      purpose: "payout",
      fund_account: {
        account_type: "bank_account",
        bank_account: {
          name: data.name,
          ifsc: data.ifsc,
          account_number: data.bank_account,
        },
        contact: {
          name: data.name,
          email: data.email,
          contact: data.mobile,
          type: "customer",
          reference_id: data.userId,
          notes: {
            notes_key_1: "Tea, Earl Grey, Hot",
            notes_key_2: "Tea, Earl Grey… decaf.",
          },
        },
      },
      queue_if_low_balance: true,
      reference_id: "Acme Transaction ID 12345",
      narration: "Acme Corp Fund Transfer",
      notes: {
        userId: data.userId,
        orderId: data.orderId,
      },
    };
  }

  // request.post( { url: reqUrl,
  //     headers: headersList,
  //     body: payload,
  //     json: true, },
  //   (err, res, body) => {
  //     if (err) {
  //       console.error(err);
  //       return;
  //     }
  //     console.log(body);

  //     if (body.status === "processing") {
  //       //update database here
  //     } else {
  //       //do something else
  //     }
  //   } );
  res.json(result);
};

module.exports = { MarkPaid };
