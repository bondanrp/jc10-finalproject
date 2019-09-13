import { combineReducers } from "redux";

const init = {
  id: "",
  username: "",
};

const AuthReducer = (state = init, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":      
      return {
        ...state,
        id: action.payload.id,
        username: action.payload.username,
        cart: action.payload.addedItems
      };
      case "LOGOUT_SUCCESS":
        return init
    default:
      return state;
  }
};

const reducers = combineReducers({
  auth: AuthReducer
});

export default reducers;
