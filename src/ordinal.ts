import constants from './constants'
import { Rating, Options } from './types'

const ordinal = (rating: Rating, options: Options = {}) => {
  const { sigma, mu } = rating
  const { Z } = constants(options)
  return mu - Z * sigma
}

export default ordinal
