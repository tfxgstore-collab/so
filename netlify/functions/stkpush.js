import fetch from "node-fetch";

export async function handler(event) {
  const { phone, amount, product, link } = JSON.parse(event.body);

  const shortcode = "174379"; // Test paybill
  const passkey = process.env.PASSKEY;
  const consumerKey = process.env.CONSUMER_KEY;
  const consumerSecret = process.env.CONSUMER_SECRET;

  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g,'').slice(0,14);
  const password = Buffer.from(shortcode+passkey+timestamp).toString("base64");

  // Get access token
  const auth = Buffer.from(consumerKey+":"+consumerSecret).toString("base64");
  const tokenRes = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
    headers:{ Authorization: "Basic "+auth }
  });
  const { access_token } = await tokenRes.json();

  // STK Push request
  const stkRes = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",{
    method:"POST",
    headers:{
      Authorization: "Bearer "+access_token,
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: "https://siato.netlify.app/.netlify/functions/callback",
      AccountReference: product,
      TransactionDesc: "Purchase "+product
    })
  });
  const response = await stkRes.json();
  return { statusCode:200, body: JSON.stringify(response) };
}
