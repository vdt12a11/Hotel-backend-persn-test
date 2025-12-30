
module.exports = {
  accessKey: 'F8BBA842ECF85',
  secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
  orderInfo: 'pay with MoMo',
  partnerCode: 'MOMO',
  redirectUrl: 'http://localhost:5000/views/home.html',
  ipnUrl: 'https://overartificially-uncaptious-jaxson.ngrok-free.dev/callback', //chú ý: cần dùng ngrok thì momo mới post đến url này được
  requestType: 'captureWallet',
  extraData: '',
  orderGroupId: '',
  autoCapture: true,
  lang: 'vi',
};
