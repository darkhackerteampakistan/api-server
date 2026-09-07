const FILE_PATH = "data/messages.json";

export default async function handler(req, res) {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json"
    };

    const api = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${FILE_PATH}`;

    const response = await fetch(api, { headers });

    if (!response.ok) {
      throw new Error("Cannot load messages.json");
    }

    const file = await response.json();

    const data = JSON.parse(
      Buffer.from(file.content, "base64").toString("utf8")
    );

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
