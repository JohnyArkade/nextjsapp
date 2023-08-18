
function handler(req: any, res: any) {
  console.log('req.body:',  req.body)
  res.status(200).json({ success: true });
}
export default handler