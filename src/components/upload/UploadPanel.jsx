import { useState, useRef } from "react"

export default function UploadPanel({

  refreshArtworks

}) {

const [title, setTitle] = useState("")
const [image, setImage] = useState(null)
const [preview, setPreview] = useState(null)
const [loading, setLoading] = useState(false)

  const fileInputRef =
    useRef(null)

  const handleImage = (e) => {

    const file =
      e.target.files[0]

    if (!file) return

    setImage(file)

    setPreview(
      URL.createObjectURL(file)
    )

  }

  const handleUpload = async () => {

    if (!image) {
      fileInputRef.current.click()
      return
    }

    if (!title) {
      alert("Add title first")
      return
    }

    try {

      setLoading(true)

      const formData = new FormData()

      formData.append("title", title)
      formData.append("image", image)

      const response = await fetch(
        "http://localhost:5000/upload",
        {
          method: "POST",
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      alert("Artwork uploaded")

      setTitle("")
      setImage(null)
      setPreview(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      refreshArtworks()

    } catch (error) {

      console.log(error)

      alert("Upload failed")

    } finally {

      setLoading(false)

    }

  }

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
        hidden
      />

      {

        preview && (

          <img
            src={preview}
            alt="preview"
            className="uploadPreview"
          />

        )

      }

      <div className="filePreview">

        {

          image
            ? image.name
            : "No artwork selected"

        }

      </div>

      {

        !image ? (

          <button
            onClick={() =>
              fileInputRef.current.click()
            }
          >
            Choose Artwork
          </button>

        ) : (

          <div className="uploadActions">

            <button
              onClick={handleUpload}
              disabled={loading}
            >
              {
                loading
                  ? "Uploading..."
                  : "Upload Artwork"
              }
            </button>

            <button
              className="changeButton"
              onClick={() =>
                fileInputRef.current.click()
              }
            >
              Change Artwork
            </button>

          </div>

        )

      }

    </div>

  )

}