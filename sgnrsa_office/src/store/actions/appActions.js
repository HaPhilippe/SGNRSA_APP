import { SET_BREADCRUMB, SET_TOAST } from "../reducers/appReducer"

export const setBreadCrumbItemsAction = (items) => {
          return {
                    type: SET_BREADCRUMB,
                    payload: items
          }
}

export const setToastAction = toast => {
          return {
                    type: SET_TOAST,
                    payload: toast
          }
}