import constants from './constants'
import { Rating, Options } from './types'

const ordinal = (rating: Rating, options: Options = {}): number => {
  const { sigma, mu } = rating
  const { Z } = constants(options)
  return mu - Z * sigma
}

export default ordinal
