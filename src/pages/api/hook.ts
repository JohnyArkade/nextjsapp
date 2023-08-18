import { createHmac } from "crypto";


export const config = {
  api: {
    bodyParser: false
  },
}

function getRawBody(readable:any){
  const chunks = [];
  for (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}


function handler(req: any, res: any) {
  console.log('req.body:',  req.body)
  const signature = req.headers["x-xero-signature"];
  console.log("signature:", signature)
  if (req.method !== "POST") {
    res.status(401).json({ success: false, message: "Method not supported"});
    return
  }

  const rawBody = getRawBody(req);
  
  // const rawBody = await getRawBody(req);
  // const rawBody = JSON.stringify(req.body).split(':').join(': ')
  //       .split(': [').join(':[')
  //       .split(',"entropy"').join(', "entropy"')
  const rawData = Buffer.from(rawBody).toString("utf8");
  req.body = JSON.parse(rawData);

  const alg = "sha256";
  const webhookKey = "UOvIHHFi4dC4SeIMg7rtT7CI28vYvzxbP4Kf5fXqvA1RjbgJvZQ+LH7N9eF0X5RV+cWo8wC1nG3VhnE251ICOQ=="
  const hashSignature = createHmac(alg, webhookKey)
    .update(rawData)
    .digest("base64");

  console.log("hash2:",signature === hashSignature, signature, hashSignature)
  console.log(signature.length, hashSignature.length)

  for (let index = 0; index < signature.length; index++) {
    const element = signature[index];
    const element2 = hashSignature[index];
    if(element !== element2){
      console.log("index:", index, element, element2)
    }
  }

  if(signature === hashSignature){
    res.status(200).json({ success: true });
  }else{
    res.status(401).json({ success: false });
  }
}
export default handler