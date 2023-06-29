import './index.css'

const SimilarProductItem = props => {
  const {eachProduct} = props
  const productItem = {
    imageUrl: eachProduct.image_url,
    title: eachProduct.title,
    brand: eachProduct.brand,
    price: eachProduct.price,
    rating: eachProduct.rating,
  }
  const {title, brand, price, rating, imageUrl} = productItem

  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-img"
      />
      <h1 className="similar-product-title">{title}</h1>
      <p className="similar-product-brand">by {brand}</p>
      <div className="price-rating-container">
        <p className="similar-product-price">Rs {price}/-</p>
        <div className="similar-product-rating-container">
          <p className="similar-product-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
