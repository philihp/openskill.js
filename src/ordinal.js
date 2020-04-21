const ordinal = ({ sigma, mu, rating }) => {
  return rating === undefined ? mu - 3 * sigma : rating
}

export default ordinal
