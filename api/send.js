const FILE_PATH = "data/messages.json";
const BRANCH = "main";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {
    // GET অথবা POST থেকে ডেটা নিন
    const data = req.method === "GET" ? req.query : req.body;

    const name = data.name || "Anonymous";
    const message = data.message;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json"
    };

    const api = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${FILE_PATH}`;

    // Read current file
    const fileRes = await fetch(api, { headers });

    if (!fileRes.ok) {
      const err = await fileRes.text();
      throw new Error(err);
    }

    const file = await fileRes.json();

    const content = JSON.parse(
      Buffer.from(file.content, "base64").toString("utf8")
    );

    // Add new request
    content.push({
      id: Date.now().toString(),
      name,
      message,
      ip:
        req.headers["x-forwarded-for"] ||
        req.socket?.remoteAddress ||
        "Unknown",
      method: req.method,
      time: new Date().toISOString()
    });

    const updated = Buffer.from(
      JSON.stringify(content, null, 2)
    ).toString("base64");

    // Update GitHub file
    const update = await fetch(api, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `New request ${Date.now()}`,
        content: updated,
        sha: file.sha,
        branch: BRANCH
      })
    });

    if (!update.ok) {
      const err = await update.text();
      throw new Error(err);
    }

    return res.status(200).json({
      success: true,
      message: "Saved successfully",
      data: {
        name,
        message
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
