import { combineReducers } from "redux"
import BaseReducer from "./BaseReducer"

const RootReducer = combineReducers({
    base: BaseReducer,
  })
  export default RootReducer