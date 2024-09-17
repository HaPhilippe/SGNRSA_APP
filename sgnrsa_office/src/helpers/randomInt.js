/**
 * Génerer un entier aléatoire
 * @param {Number} min minimum
 * @param {Number} max maximum
 * @param {Number} exclude l'entier que vous ne voulez pas recevoir entre ce min et max
 * @returns 
 */
export default function randomInt (min, max, exclude) {
          let number = Math.round(Math.random() * (max - min) + min)
          while(number == exclude) {
                    number = Math.round(Math.random() * (max - min) + min)
          }
          return number
}