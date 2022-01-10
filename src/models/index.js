import plackettLuce from './plackett-luce'
import bradleyTerryFull from './bradley-terry-full'
import bradleyTerryPart from './bradley-terry-part'
import thurstoneMostellerFull from './thurstone-mosteller-full'
import thurstoneMostellerPart from './thurstone-mosteller-part'

export default {
  plackettLuce,
  bradleyTerryFull,
  bradleyTerryPart,
  thurstonMostellerFull: thurstoneMostellerFull, // for compatibility with typo in earlier implementation
  thurstonMostellerPart: thurstoneMostellerPart, // for compatibility with typo in earlier implementation
  thurstoneMostellerFull,
  thurstoneMostellerPart,
}
