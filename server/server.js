const express = require("express")
const cors = require("cors")
const multer = require("multer")
const fs = require("fs")
const path = require("path")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { createClient } = require("@supabase/supabase-js")

require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

/* =========================
   SUPABASE
========================= */

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BUCKET = "artworks"

/* =========================
   ADMIN AUTHENTICATION
========================= */

function authenticateAdmin(req, res, next) {

  const authHeader = req.headers.authorization

  const token =
    authHeader &&
    authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized"
    })
  }

  try {

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      )

    if (!decoded.admin) {
      return res.status(403).json({
        error: "Forbidden"
      })
    }

    req.admin = decoded

    next()

  } catch (error) {

    return res.status(401).json({
      error: "Invalid or expired token"
    })

  }

}

/* =========================
   MULTER
========================= */

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024
  }
})

/* =========================
   ADMIN LOGIN
========================= */

app.post("/admin-login", async (req, res) => {

  const { password } = req.body

  try {

    const isMatch = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    )

    if (!isMatch) {
      return res.status(401).json({
        success: false
      })
    }

    const token = jwt.sign(
      { admin: true },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    )

    res.json({
      success: true,
      token
    })

  } catch (error) {

    console.error("Login error:", error)

    res.status(500).json({
      success: false,
      error: "Server error"
    })

  }

})

/* =========================
   GET ARTWORKS
========================= */

app.get("/artworks", async (req, res) => {

  try {

    const { data, error } = await supabase
      .from("artworks")
      .select("id, title, filename, image_url")
      .order("created_at", {
        ascending: true
      })

    if (error) {
      throw error
    }

    res.json(
  data.map(artwork => ({
    id: artwork.id,
    title: artwork.title,
    filename: artwork.filename,
    image: artwork.image_url
  }))
)

  } catch (error) {

    console.error("Get artworks error:", error)

    res.status(500).json({
      error: "Failed to load artworks"
    })

  }

})

/* =========================
   UPLOAD ARTWORK
========================= */

app.post(
  "/upload",
  authenticateAdmin,
  upload.single("image"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          error: "No image uploaded"
        })
      }

      const filename =
        Date.now() +
        path.extname(req.file.originalname)

      /* Upload image to Supabase Storage */

      const { error: uploadError } =
        await supabase.storage
          .from(BUCKET)
          .upload(
            filename,
            req.file.buffer,
            {
              contentType: req.file.mimetype,
              upsert: false
            }
          )

      if (uploadError) {
        throw uploadError
      }

      /* Get public image URL */

      const { data: publicData } =
        supabase.storage
          .from(BUCKET)
          .getPublicUrl(filename)

      const imageUrl =
        publicData.publicUrl

      /* Save artwork information */

      const { data, error } =
        await supabase
          .from("artworks")
          .insert({
            title: req.body.title,
            filename: filename,
            image_url: imageUrl
          })
          .select()
          .single()

      if (error) {

        /* Remove uploaded image if database insert fails */

        await supabase.storage
          .from(BUCKET)
          .remove([filename])

        throw error
      }

      res.json(data)

    } catch (error) {

      console.error("Upload error:", error)

      res.status(500).json({
        error: "Failed to upload artwork"
      })

    }

  }
)

/* =========================
   DELETE ARTWORK
========================= */

app.delete(
  "/artworks",
  authenticateAdmin,
  async (req, res) => {

    try {

      const { filename } = req.body

      if (!filename) {
        return res.status(400).json({
          error: "Filename required"
        })
      }

      /* Delete image from Storage */

      const { error: storageError } =
        await supabase.storage
          .from(BUCKET)
          .remove([filename])

      if (storageError) {
        console.error(
          "Storage delete error:",
          storageError
        )
      }

      /* Delete database record */

      const { error: databaseError } =
        await supabase
          .from("artworks")
          .delete()
          .eq("filename", filename)

      if (databaseError) {
        throw databaseError
      }

      res.json({
        success: true
      })

    } catch (error) {

      console.error("Delete error:", error)

      res.status(500).json({
        error: "Failed to delete artwork"
      })

    }

  }
)

/* =========================
   START SERVER
========================= */

const PORT =
  process.env.PORT || 5000

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `Server running on port ${PORT}`
    )

  }
)