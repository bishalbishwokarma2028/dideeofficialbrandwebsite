import { Router } from "express";
import multer from "multer";
import path from "path";
import { uploadFileToSupabase } from "../lib/supabase.js";

const router = Router();

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (JPEG, PNG, WebP, GIF)"));
  }
};

const memStorage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

// POST /api/upload
router.post("/", memStorage.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  try {
    const ext = path.extname(req.file.originalname) || ".jpg";
    const filename = `products/${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;

    const supabaseUrl = await uploadFileToSupabase(req.file.buffer, filename, req.file.mimetype);
    if (supabaseUrl) {
      res.json({ url: supabaseUrl, filename });
      return;
    }

    res.status(503).json({
      error: "Image upload requires Supabase Storage. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.",
    });
  } catch (err: any) {
    console.error("[Upload] Error:", err);
    res.status(500).json({ error: "Upload failed: " + (err.message ?? "Unknown error") });
  }
});

export default router;
