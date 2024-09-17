import { SET_USER, UNSET_USER } from "../reducers/userReducer"

export const setUserAction = (user) => {
          return {
                    type: SET_USER,
                    payload: user
          }
}
export const unsetUserAction = () => {
          return {
                    type: UNSET_USER
          }
}