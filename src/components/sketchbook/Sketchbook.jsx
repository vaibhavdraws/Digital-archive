import { useState, useEffect } from "react"

import ArtworkPage from "./ArtworkPage"

import NavigationButtons
  from "./NavigationButtons"

import ArtworkModal
  from "../modal/ArtworkModal"

import UploadPanel
  from "../upload/UploadPanel"

export default function Sketchbook({

  isAdmin

}) {

  const [page, setPage]
    = useState(0)

  const [mobile, setMobile]
    = useState(window.innerWidth < 900)

  const [selectedArtwork,
    setSelectedArtwork]
    = useState(null)

  const [artworks, setArtworks]
    = useState([])

  /* =========================
     LOAD ARTWORKS
  ========================= */

  const fetchArtworks =
    async () => {

      try {

        const response =
          await fetch(
            "http://localhost:5000/artworks"
          )

        const data =
          await response.json()

        console.log("ARTWORKS:", data)

        setArtworks(data)

      } catch (error) {

        console.log(error)

      }

    }

  const deleteArtwork = async (
    artwork
  ) => {

    if (

      !window.confirm(

        `Delete "${artwork.title}" ?`

      )

    ) {

      return

    }

    try {

      const filename =
        artwork.image.split("/")
          .pop()

      await fetch(

        "http://localhost:5000/artworks",

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

      fetchArtworks()

    } catch (error) {

      console.log(error)

    }

  }
  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {

    fetchArtworks()

  }, [])

  /* =========================
     MOBILE CHECK
  ========================= */

  useEffect(() => {

    const handleResize = () => {

      setMobile(
        window.innerWidth < 900
      )

    }

    window.addEventListener(
      "resize",
      handleResize
    )

    return () =>

      window.removeEventListener(
        "resize",
        handleResize
      )

  }, [])

  const step =
    mobile ? 1 : 2

  /* =========================
     NEXT PAGE
  ========================= */

  const nextPage = () => {

    if (
      page <
      artworks.length - step
    ) {

      setPage(
        prev => prev + step
      )

    }

  }

  /* =========================
     PREVIOUS PAGE
  ========================= */

  const prevPage = () => {

    if (page > 0) {

      setPage(
        prev => prev - step
      )

    }

  }

  /* =========================
     MODAL
  ========================= */

  const openModal = (artwork) => {

    setSelectedArtwork(
      artwork
    )

  }

  const closeModal = () => {

    setSelectedArtwork(null)

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
          openModal={openModal}
          isAdmin={isAdmin}
          deleteArtwork={deleteArtwork}
        />

        {!mobile && (

          <ArtworkPage
            artwork={artworks[page + 1]}
            openModal={openModal}
            isAdmin={isAdmin}
            deleteArtwork={deleteArtwork}
          />

        )}

      </div>

      <ArtworkModal
        artwork={selectedArtwork}
        closeModal={closeModal}
      />

      {isAdmin && (

        <UploadPanel
          refreshArtworks={fetchArtworks}
        />

      )}

    </section>

  )

}

