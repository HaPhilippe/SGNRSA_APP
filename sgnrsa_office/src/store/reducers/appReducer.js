export const SET_BREADCRUMB = "SET_BREADCRUMB"
export const SET_TOAST = "SET_TOAST"

const initial = {
          breadCrumbItems: [],
          toast: null
}
export default function appReducer(contributionState = initial, action) {
          switch (action.type) {
                    case SET_BREADCRUMB:
                              return {...contributionState, breadCrumbItems: action.payload}
                    case SET_TOAST:
                              return {...contributionState, toast: action.payload}
                    default:
                              return contributionState
          }
}