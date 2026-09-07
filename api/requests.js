import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "data", "messages.json");

    if (!fs.existsSync(filePath)) {
      return res.status(200).json([]);
    }

    const file = fs.readFileSync(filePath, "utf8");

    const data = file ? JSON.parse(file) : [];

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
