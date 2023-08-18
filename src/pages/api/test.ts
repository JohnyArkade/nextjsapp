import { createHmac } from "crypto";

function handler(req: any, res: any) {
  const bodyJson = {
    events: [],
    firstEventSequence: 0,
    lastEventSequence: 0,
    entropy: 'ESFOKGDEKGVDEURBHNRH'
  }
  const rawBody = JSON.stringify(bodyJson).split(':').join(': ')
        .split(': [').join(':[')
        .split(',"entropy"').join(', "entropy"')
  const rawData = Buffer.from(rawBody).toString("utf8");
  req.body = JSON.parse(rawData);
  console.log('req.body:',  req.body)

  const alg = "sha256";
  const webhookKey = "UOvIHHFi4dC4SeIMg7rtT7CI28vYvzxbP4Kf5fXqvA1RjbgJvZQ+LH7N9eF0X5RV+cWo8wC1nG3VhnE251ICOQ=="
  const hashSignature = createHmac(alg, webhookKey)
    .update(rawData)
    .digest("base64");

  const signature = "N5PtubSMs0SrCH9YJGAzm/pj4t5XdYgpfaZR/qtnQDg="
  const signature2 = "N5PtubSMs0SrCH9YJGAzm/pj4t5XdYgpfaZRAqtnQDg="
  console.log("hash2:",signature === hashSignature, signature, signature2, hashSignature)
  console.log(signature.length, hashSignature.length)

  for (let index = 0; index < signature.length; index++) {
    const element = signature[index];
    const element2 = hashSignature[index];
    if(element !== element2){
      console.log("index:", index, element, element2)
    }
  }

  res.status(200).json({ success: true });
}
export default handler