export default async function handler(req, res) {
  switch (req.method) {
    default:
      return res.status(405).json({ message: "API operational" });
  }
}
