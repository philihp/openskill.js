import constants from './constants'

const ordinal = ({ sigma, mu }, options = {}) => {
  const { Z } = constants(options)
  return mu - Z * sigma
}

export default ordinal
