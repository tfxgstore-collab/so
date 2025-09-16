export async function handler(event) {
  const body = JSON.parse(event.body || "{}");

  try {
    const resultCode = body.Body.stkCallback.ResultCode;
    const meta = body.Body.stkCallback.CallbackMetadata?.Item || [];
    const product = body.Body.stkCallback.AccountReference;

    if(resultCode === 0){
      return {
        statusCode:302,
        headers:{ Location: `https://siato.netlify.app/thankyou.html?product=${encodeURIComponent(product)}` },
        body:""
      };
    }
    return { statusCode:200, body:"Payment Failed/Cancelled" };
  } catch(e){
    return { statusCode:200, body:"Callback Parse Error" };
  }
}
