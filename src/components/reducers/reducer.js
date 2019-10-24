import { combineReducers } from "redux";

const init = {
  id: "",
  username: "",
  role: "",
  profilepict: "",
  premium: ""
};

const AuthReducer = (state = init, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        id: action.payload.id,
        username: action.payload.username,
        role: action.payload.role,
        profilepict: action.payload.profilepict,
        premium: action.payload.premium
      };
    case "PROFILE_UPDATED":
      return {
        ...state,
        profilepict: action.payload.profilepict
      };
    case "LOGOUT_SUCCESS":
      return init;
    default:
      return state;
  }
};

const reducers = combineReducers({
  auth: AuthReducer
});

export default reducers;
