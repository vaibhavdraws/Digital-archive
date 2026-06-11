export default function ArtworkPage({

  artwork,
  openModal,
  isAdmin,
  deleteArtwork

}){

  if(!artwork) return null

  return(

    <div className="page">

      <img
        src={artwork.image}
        alt={artwork.title}
        onClick={() => openModal(artwork)}
      />

      <h2>
        {artwork.title}
      </h2>

      {

        isAdmin && (

          <button
            className="deleteButton"
            onClick={() =>
              deleteArtwork(artwork)
            }
          >

            Delete Artwork

          </button>

        )

      }

    </div>

  )

}