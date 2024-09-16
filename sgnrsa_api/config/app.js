const dotenv = require('dotenv')

dotenv.config()
module.exports = {
          DEFAULT_TIMEZONE: "Africa/bujumbura",
          DEFAULT_JWT_REFRESH_PRIVATE_KEY: "\L/@B8?o4@vp-3MCt!,*\S@,e7+-TK]'a5M8o!t)!\cMqhw|aO4i8}Uq*L7,46)--}4c-]\[el/3D-G-F#pg4*FPP.xoYqa-W3,s|8.(tCa(s@uC;:L",
          BACKEND_URL: process.env.NODE_ENV == 'local' ? "http://localhost:2024" : 'https://sgnrsa.com:1020'
}