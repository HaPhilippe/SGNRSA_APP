export const SET_USER = "SET_USER"
export const  UNSET_USER = "UNSET_USER"

export default function userReducer(user = null, action) {
          switch (action.type) {
                    case SET_USER:
                              // action.payload && localStorage.setItem('user', JSON.stringify({...action.payload}))
                              return action.payload
                    case UNSET_USER:
                              return null
          
                    default:
                              return user
          }
}