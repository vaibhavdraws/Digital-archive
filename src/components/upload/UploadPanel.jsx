import { useState, useRef } from "react"

export default function UploadPanel({

  refreshArtworks

}) {

  const [title, setTitle]
    = useState("")

  const [image, setImage]
    = useState(null)

  const [loading, setLoading]
    = useState(false)

  const fileInputRef =
    useRef(null)

  /* =========================
     IMAGE SELECT
  ========================= */

  const handleImage = (e) => {

    setImage(
      e.target.files[0]
    )

  }

  /* =========================
     UPLOAD
  ========================= */

  const handleUpload = async () => {

    if (!title || !image) {

      alert(
        "Add title and image"
      )

      return

    }

    try {

      setLoading(true)

      const formData =
        new FormData()

      formData.append(
        "title",
        title
      )

      formData.append(
        "image",
        image
      )

      const response =
        await fetch(

          "http://localhost:5000/upload",

          {

            method: "POST",

            body: formData

          }

        )

      if (!response.ok) {

        throw new Error(
          "Upload failed"
        )

      }

      alert(
        "Artwork uploaded"
      )

      setTitle("")
      setImage(null)

      refreshArtworks()

    } catch (error) {

      console.log(error)

      alert(
        "Upload failed"
      )

    } finally {

      setLoading(false)

    }

  }

  /* =========================
     PANEL
  ========================= */

  return (

    <div className="uploadPanel">

      <h2>
        Upload Artwork
      </h2>

      <input
        type="text"
        placeholder="Artwork title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImage}
        style={{
          display: "none"
        }}
      />

      <div className="filePreview">

        {

          image
            ? image.name
            : "No artwork selected"

        }

      </div>

      <button

        onClick={() => {

          if (!image) {

            fileInputRef.current.click()

            return

          }

          handleUpload()

        }}

        disabled={loading}

      >

        {
          loading
            ? "Uploading..."

            : image

              ? "Upload Artwork"

              : "Choose Artwork"
        }

      </button>

    </div>

  )

}