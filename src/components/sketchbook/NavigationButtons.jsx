export default function NavigationButtons({

  nextPage,
  prevPage

}){

  return(

    <>

      <button
        className="navButton left"
        onClick={prevPage}
      >
        ←
      </button>

      <button
        className="navButton right"
        onClick={nextPage}
      >
        →
      </button>

    </>

  )
}