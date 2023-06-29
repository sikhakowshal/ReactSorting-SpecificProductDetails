import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    productQuantity: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = {
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        title: fetchedData.title,
        price: fetchedData.price,
        description: fetchedData.description,
        brand: fetchedData.brand,
        totalReviews: fetchedData.total_reviews,
        rating: fetchedData.rating,
        availability: fetchedData.availability,
        similarProducts: fetchedData.similar_products,
      }
      this.setState({
        productDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  productDetailsView = () => {
    const {productDetails, productQuantity} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
      similarProducts,
    } = productDetails

    return (
      <>
        <Header />
        <div className="product-details-bg-section">
          <div className="product-details-container">
            <img src={imageUrl} alt="product" className="product-details-img" />
            <div className="products-info-container">
              <h1 className="product-title">{title}</h1>
              <p className="product-price">Rs {price}/-</p>
              <div className="rating-review-container">
                <div className="rating-container">
                  <p className="product-rating">{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star"
                  />
                </div>
                <p className="reviews-count">{totalReviews} Reviews</p>
              </div>
              <p className="product-description">{description}</p>
              <div className="text-container">
                <p className="availability">Available: </p>
                <p className="product-details-text">{availability}</p>
              </div>
              <div className="text-container">
                <p className="product-brand">Brand:</p>
                <p className="product-details-text">{brand}</p>
              </div>

              <hr className="line" />
              <div className="product-quantity-container">
                <button
                  className="quantity-icon-btn"
                  type="button"
                  data-testid="minus"
                  onClick={this.onClickDecrementBtn}
                >
                  <BsDashSquare className="icon" />
                </button>
                <p className="product-quantity">{productQuantity}</p>
                <button
                  className="quantity-icon-btn"
                  type="button"
                  data-testid="plus"
                  onClick={this.onClickIncrementBtn}
                >
                  <BsPlusSquare className="icon" />
                </button>
              </div>
              <button className="cart-btn" type="button">
                ADD TO CART
              </button>
            </div>
          </div>
          <ul className="similar-products-container">
            {similarProducts.map(eachProduct => (
              <SimilarProductItem
                key={eachProduct.id}
                eachProduct={eachProduct}
              />
            ))}
          </ul>
        </div>
      </>
    )
  }

  failureView = () => {
    const onClickContinueShoppingBtn = () => {
      const {history} = this.props
      history.replace('/products')
    }

    return (
      <div className="product-details-bg-section">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          className="failure-img"
          alt="failure view"
        />
        <h1 className="error-title">Product Not Found</h1>
        <button
          type="button"
          className="continue-shopping-btn"
          onClick={onClickContinueShoppingBtn}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  loadingView = () => (
    <div className="loader-container">
      <div data-testid="loader">
        <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
      </div>
    </div>
  )

  onClickDecrementBtn = () => {
    const {productQuantity} = this.state

    if (productQuantity > 1) {
      this.setState(preState => ({
        productQuantity: preState.productQuantity - 1,
      }))
    }
  }

  onClickIncrementBtn = () => {
    this.setState(preState => ({
      productQuantity: preState.productQuantity + 1,
    }))
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.productDetailsView()
      case apiStatusConstants.failure:
        return this.failureView()
      case apiStatusConstants.inProgress:
        return this.loadingView()
      default:
        return null
    }
  }

  render() {
    return this.renderProductDetails()
  }
}

export default ProductItemDetails
