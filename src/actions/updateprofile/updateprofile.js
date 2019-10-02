export const updateProfile = profilepict => {
  return dispatch => {
    dispatch({ type: "PROFILE_UPDATED", payload: { profilepict } });
  };
};
