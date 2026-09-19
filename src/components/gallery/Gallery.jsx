import { useState } from "react"
import ArtworkModal from "../modal/ArtworkModal"

export default function Gallery({

  artworks

}) {

  const [selectedArtwork,
    setSelectedArtwork]
    = useState(null)

  return (

    <>

      <section className="galleryGrid">

        {

          artworks.map((artwork, index) => (

            <div
              key={index}
              className="galleryItem"
              onClick={() =>
                setSelectedArtwork(
                  artwork
                )
              }
            >

              <img
                src={artwork.image}
                alt={artwork.title}
              />

            </div>

          ))

        }

      </section>

      <ArtworkModal
        artwork={selectedArtwork}
        closeModal={() =>
          setSelectedArtwork(null)
        }
      />

    </>

  )

}