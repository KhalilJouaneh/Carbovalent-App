export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { searchQuery, column, pageNumber, direction } = req.body;

  console.log("req.body", req.body);

  const resp = await fetch(
    `https://api.goldstandard.org/credits?query=&size=25&page=${pageNumber}&issuances=true`
  );

  const data = await resp.json();
  return res.status(200).json(data);
}
