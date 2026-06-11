export default function ArtworkModal({

  artwork,
  closeModal

}){

  if(!artwork) return null

  return(

    <div
      className="modalOverlay"
      onClick={closeModal}
    >

      <div
        className="modalContent"
        onClick={(e)=>e.stopPropagation()}
      >

        <img
          src={artwork.image}
          alt={artwork.title}
        />

        <div className="modalInfo">

          <h2>
            {artwork.title}
          </h2>

          <p>
            Personal artwork archive
          </p>

        </div>

      </div>

    </div>

  )

}