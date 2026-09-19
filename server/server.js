const express = require("express")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const artworksFile =
  path.join(__dirname, "artworks.json")

const app = express()

app.use(cors())

app.use(express.json())

/*;(async () => {
  const result = await bcrypt.compare(
    "gillu123",
    process.env.ADMIN_PASSWORD_HASH
  )

  console.log("Password check:", result)
})() */

app.post("https://captain-lawc-api.onrender.com/admin-login", async (req, res) => {

  const { password } = req.body

  const isMatch =
    await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    )

  if (isMatch) {
    const token = jwt.sign(
      { admin: true },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    )

    return res.json({
      success: true,
      token
    })
  }

  res.status(401).json({
    success: false
  })

})
/* =========================
   CREATE UPLOAD FOLDER
========================= */

const uploadPath =
  path.join(__dirname, "uploads")

if (!fs.existsSync(uploadPath)) {

  fs.mkdirSync(uploadPath)

}

/* =========================
   STORAGE CONFIG
========================= */

const storage =
  multer.diskStorage({

    destination: (req, file, cb) => {

      cb(null, uploadPath)

    },

    filename: (req, file, cb) => {

      cb(

        null,

        Date.now() +
        path.extname(
          file.originalname
        )

      )

    }

  })

const upload =
  multer({

    storage,

    limits: {

      fileSize:
        10 * 1024 * 1024

    }

  })

/* =========================
   GET ARTWORKS
========================= */

app.get("/artworks", (req, res) => {

  const artworks =

    JSON.parse(

      fs.readFileSync(
        artworksFile,
        "utf8"
      )

    )

  const formatted =

    artworks.map(

      artwork => ({

        id: artwork.id,

        title: artwork.title,

        image:
    `https://captain-lawc-api.onrender.com/uploads/${artwork.filename}`

      })

    )

  res.json(formatted)

})

/* =========================
   UPLOAD ARTWORK
========================= */

app.post(

  "/upload",

  upload.single("image"),

  (req, res) => {

    if (!req.file) {

      return res.status(400).json({

        error: "No image uploaded"

      })

    }

    const artworks =

      JSON.parse(

        fs.readFileSync(
          artworksFile,
          "utf8"
        )

      )

    const newArtwork = {

      id: Date.now(),

      title: req.body.title,

      filename: req.file.filename

    }

    artworks.push(newArtwork)

    fs.writeFileSync(

      artworksFile,

      JSON.stringify(
        artworks,
        null,
        2
      )

    )

    res.json(newArtwork)

  }

)

/* =========================
   DELETE ARTWORK
========================= */

app.delete(

  "/artworks",

  (req, res) => {

    const { filename } =
      req.body

    if (!filename) {

      return res.status(400).json({

        error: "Filename required"

      })

    }

    const filePath =
      path.join(
        uploadPath,
        filename
      )

    if (fs.existsSync(filePath)) {

      fs.unlinkSync(filePath)

    }

    let artworks =

      JSON.parse(

        fs.readFileSync(
          artworksFile,
          "utf8"
        )

      )

    artworks = artworks.filter(

      artwork =>

        artwork.filename !==
        filename

    )

    fs.writeFileSync(

      artworksFile,

      JSON.stringify(
        artworks,
        null,
        2
      )

    )

    res.json({

      success: true

    })

  }

)

/* =========================
   STATIC FILES
========================= */

app.use(

  "/uploads",

  express.static(uploadPath)

)

/* =========================
   ADMIN LOGIN
========================= */

app.post("https://captain-lawc-api.onrender.com/admin-login", (req, res) => {

  const { password } = req.body

  if (
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({
      success: true
    })
  }

  res.status(401).json({
    success: false
  })

})
/* =========================
   START SERVER
========================= */

app.listen(process.env.PORT || 5000, '0.0.0.0', () => {

    console.log(
        `Server running on port ${process.env.PORT || 5000}`
    )

})