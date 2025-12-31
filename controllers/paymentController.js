const User = require('../model/user');
const config = require('../config/momoConfig');
const axios = require('axios');
const crypto = require('crypto');
const Booking = require('../model/booking');
const checkStatusTransaction=async (req, res) => {
  const { orderId } = req.body;

  // const signature = accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode
  // &requestId=$requestId
  var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  var accessKey = 'F8BBA842ECF85';
  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = JSON.stringify({
    partnerCode: 'MOMO',
    requestId: orderId,
    orderId: orderId,
    signature: signature,
    lang: 'vi',
  });

  // options for axios
  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/query',
    headers: {
      'Content-Type': 'application/json',
    },
    data: requestBody,
  };

  const result = await axios(options);
  if(result.data.resultCode == 0){
    return true;
  }
  return false;
};
const createPayment = async({ orderId, amount })=>{
  let {
    accessKey,
    secretKey,
    orderInfo,
    partnerCode,
    redirectUrl,
    ipnUrl,
    requestType,
    extraData,
    orderGroupId,
    autoCapture,
    lang,
  } = config;
  const requestId = orderId;
  const rawSignature =
    `accessKey=${accessKey}` +
    `&amount=${amount}` +
    `&extraData=${extraData}` +
    `&ipnUrl=${ipnUrl}` +
    `&orderId=${orderId}` +
    `&orderInfo=${orderInfo}` +
    `&partnerCode=${partnerCode}` +
    `&redirectUrl=${redirectUrl}` +
    `&requestId=${requestId}` +
    `&requestType=${requestType}`;

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = JSON.stringify({
    partnerCode,
    partnerName: 'Test',
    storeId: 'MomoTestStore',
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang,
    requestType,
    autoCapture,
    extraData,
    orderGroupId,
    signature,
  });

  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/create',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };
  console.log(requestBody);
  const result = await axios(options);
  
  return result.data; // 🔥 QUAN TRỌNG
}


const linkingMomo = async(req,res) => {
  console.log('linkmmo');
  let {
    accessKey,
    secretKey,
    orderInfo,
    partnerCode,
    redirectUrl,
    ipnUrl,
    requestType,
    extraData,
    orderGroupId,
    autoCapture,
    lang,
  } = config;
  ipnUrl = 'https://hotel-backend-persn-test.onrender.com/payment/callback/wallet';
  var amount = '0';
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;
  const {userID,email} =req.body;
  console.log("email and userID ",userID,"  ",email);
  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    'accessKey=' +
    accessKey +
    '&amount=' +
    amount +
    '&extraData=' +
    extraData +
    '&ipnUrl=' +
    ipnUrl +
    '&orderId=' +
    orderId +
    '&orderInfo=' +
    orderInfo +
    '&partnerClientId=' +
    userID +
    '&partnerCode=' +
    partnerCode +
    '&redirectUrl=' +
    redirectUrl +
    '&requestId=' +
    requestId +
    '&requestType=' +
    'linkWallet';

  //signature
  var signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: 'Test',
    storeId: 'MomoTestStore',
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: 'linkWallet',
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
    partnerClientId: userID,
    userInfo: {
      partnerClientAlias: email,
    },
  });
  console.log(requestBody);
  // options for axios
  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/create',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };
  // Send the request and handle the response
  let result;
  try {
    result = await axios(options);
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};
const callbackOrder = async(req,res) => {
  console.log('callbackOrder: ');
  console.log(req.body);
  try {
    let {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = req.body;
    ipnUrl = 'https://hotel-backend-persn-test.onrender.com/payment/callback/order';
    if (resultCode === 0) {
      await Booking.findOneAndUpdate(
        { orderId }, // hoặc {_id: orderId}
        {
          status: 'booked',
          momoTransId: transId,
          paidAt: new Date(responseTime),
        }
      );
    }
    else {
      await Booking.findOneAndUpdate(
        { orderId },
        { status: 'FAILED' }
      );
}
    return res.status(200).json({
      message: 'OK'
    });

  }catch(err){
    return res.status(200).json({message: 'OK'});
};
}
const callbackWallet = async (req, res) => {
  console.log("callbackWallet:");
  console.log(req.body);

  try {
    const { partnerClientId, resultCode } = req.body;

    if (resultCode === 0 && partnerClientId) {
      await User.findOneAndUpdate(
        { partnerClientId },
        { $set: { linkingWallet: "true" } }, // 👈 boolean
        { new: true }
      );
    }

    return res.status(200).json({ message: "OK" });

  } catch (err) {
    console.error("callbackWallet error:", err);
    return res.status(200).json({ message: "OK" });
  }
};

const getStatus= async (req, res) => {
  const { orderId } = req.params;
  try {
    // Tìm booking theo orderId
    const booking = await Booking.findOne({ orderId });

    if (!booking) {
      return res.status(404).json({ status: "pending", message: "Booking not found" });
    }
    // Giả sử booking.status lưu trạng thái thanh toán: "pending" | "booked" | "failed"
    return res.status(200).json({ status: booking.status });
  } catch (err) {
    console.error("Error fetching payment status:", err);
    return res.status(500).json({ status: "pending", message: "Server error" });
  }
};

module.exports={linkingMomo,callbackWallet,callbackOrder,createPayment,checkStatusTransaction,getStatus}