import { configureStore, createSerializableStateInvariantMiddleware } from "@reduxjs/toolkit";
import appReducer from "./reducers/appReducer";
import userReducer from "./reducers/userReducer";

const serializableMiddleware = createSerializableStateInvariantMiddleware({
          isSerializable: () => false,
})
const store = configureStore({
          reducer: {
                    user: userReducer,
                    app: appReducer
          },
          middleware: (getDefaultMiddleware) =>
                    getDefaultMiddleware({
                              serializableCheck: false,
                    }),
})

export default store