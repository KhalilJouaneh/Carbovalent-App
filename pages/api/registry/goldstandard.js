export default async function handler(_req, res) {
  const { searchQuery, column, pageNumber, direction } = _req.body;

  const resp = await fetch(
    `https://api.goldstandard.org/credits?query=&size=25&page=1&issuances=true`
  );

  const data = await resp.json();
  return res.status(200).json(data);
}
