import './LoaderArticle.css'

const LoaderArticle = () => {
  return (
    <>
      <div className="loader">
        <div className="cover skeleton">
          <img id="cover" src="" />
        </div>
        <div className="content">
          <h2 id="title" className="skeleton"></h2>
          <small id="subtitle" className="skeleton"></small>
          <p id="about" className="skeleton"></p>
        </div>
      </div>
    </>
  )
}

export default LoaderArticle