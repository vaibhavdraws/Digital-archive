const fs = require("fs")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")
require("dotenv").config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const artworksFile = path.join(__dirname, "artworks.json")
const uploadsFolder = path.join(__dirname, "uploads")

async function migrate() {

  const artworks = JSON.parse(
    fs.readFileSync(artworksFile, "utf8")
  )

  for (const artwork of artworks) {

    const filePath =
      path.join(uploadsFolder, artwork.filename)

    if (!fs.existsSync(filePath)) {
      console.log(
        `Skipping missing file: ${artwork.filename}`
      )
      continue
    }

    console.log(
      `Uploading: ${artwork.filename}`
    )

    const fileBuffer =
      fs.readFileSync(filePath)

    const extension =
      path.extname(artwork.filename).toLowerCase()

    let contentType = "image/jpeg"

    if (extension === ".png") {
      contentType = "image/png"
    }

    if (extension === ".webp") {
      contentType = "image/webp"
    }

    if (extension === ".gif") {
      contentType = "image/gif"
    }

    const { error: uploadError } =
      await supabase.storage
        .from("artworks")
        .upload(
          artwork.filename,
          fileBuffer,
          {
            contentType,
            upsert: true
          }
        )

    if (uploadError) {
      console.error(
        "Storage error:",
        uploadError
      )
      continue
    }

    const { data: publicData } =
      supabase.storage
        .from("artworks")
        .getPublicUrl(
          artwork.filename
        )

    const imageUrl =
      publicData.publicUrl

    const { error: databaseError } =
      await supabase
        .from("artworks")
        .insert({
          title: artwork.title,
          filename: artwork.filename,
          image_url: imageUrl
        })

    if (databaseError) {
      console.error(
        "Database error:",
        databaseError
      )
      continue
    }

    console.log(
      `Migrated: ${artwork.title}`
    )
  }

  console.log("")
  console.log("Migration complete.")
}

migrate()