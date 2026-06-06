import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { uploadFileToSupabase } from "../lib/supabase.js";

const router = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (JPEG, PNG, WebP, GIF)"));
  }
};

const memStorage = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});
const diskUpload = multer({ storage: diskStorage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });

// POST /api/upload
router.post("/", memStorage.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  try {
    const ext = path.extname(req.file.originalname) || ".jpg";
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;

    // Try Supabase Storage first (works on Vercel and all serverless environments)
    const supabaseUrl = await uploadFileToSupabase(req.file.buffer, filename, req.file.mimetype);
    if (supabaseUrl) {
      res.json({ url: supabaseUrl, filename });
      return;
    }

    // Fallback: write to local disk (dev environment only)
    const localPath = path.join(uploadsDir, filename);
    fs.writeFileSync(localPath, req.file.buffer);
    const url = `/api/uploads/${filename}`;
    res.json({ url, filename });
  } catch (err: any) {
    console.error("[Upload] Error:", err);
    res.status(500).json({ error: "Upload failed: " + (err.message ?? "Unknown error") });
  }
});

export default router;
