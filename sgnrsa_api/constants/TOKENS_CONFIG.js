const TOKENS_CONFIG = {
          /**
          * 5 minutes de temps d'expiration du token d'access pour l'application
          * @type { Number }
          */
          APP_ACCESS_TOKEN_MAX_AGE: 60 * 5,
          /**
          * Temps d'expiration du refresh token
          * @type { Number }
          */
          REFRESH_TOKEN_MAX_AGE: 3600 * 24 * 365 * 3
}

module.exports = TOKENS_CONFIG