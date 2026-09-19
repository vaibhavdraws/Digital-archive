import { useState } from "react"

import ArtworkPage from "./ArtworkPage"
import NavigationButtons from "./NavigationButtons"
import ArtworkModal from "../modal/ArtworkModal"
import UploadPanel from "../upload/UploadPanel"

export default function Sketchbook({

  isAdmin,
  artworks,
  refreshArtworks

}) {

  const [page, setPage]
    = useState(0)

  const [selectedArtwork,
    setSelectedArtwork]
    = useState(null)

  const step = 2

  const nextPage = () => {

    if (
      page < artworks.length - step
    ) {

      setPage(
        prev => prev + step
      )

    }

  }

  const prevPage = () => {

    if (page > 0) {

      setPage(
        prev => prev - step
      )

    }

  }

  const deleteArtwork = async (
    artwork
  ) => {

    const filename =
      artwork.image.split("/").pop()

    await fetch(

      "https://captain-lawc-api.onrender.com/artworks",

      {
        method: "DELETE",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          filename
        })
      }

    )

    refreshArtworks()

  }

  return (

    <section className="sketchbookWrapper">

      <NavigationButtons
        nextPage={nextPage}
        prevPage={prevPage}
      />

      <div className="book">

        <ArtworkPage
          artwork={artworks[page]}
          openModal={setSelectedArtwork}
          isAdmin={isAdmin}
          deleteArtwork={deleteArtwork}
        />

        <ArtworkPage
          artwork={artworks[page + 1]}
          openModal={setSelectedArtwork}
          isAdmin={isAdmin}
          deleteArtwork={deleteArtwork}
        />

      </div>

      <ArtworkModal
        artwork={selectedArtwork}
        closeModal={() =>
          setSelectedArtwork(null)
        }
      />

      {

        isAdmin && (

          <UploadPanel
            refreshArtworks={refreshArtworks}
          />

        )

      }

    </section>

  )

}