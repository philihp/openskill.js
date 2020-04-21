const rating = ({ mu, sigma }) => ({
  mu,
  sigma,
  rating: mu - 3 * sigma,
})

export default rating
