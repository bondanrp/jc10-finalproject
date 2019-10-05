export const updateProfile = profilepict => {
  return dispatch => {
    let data = JSON.parse(localStorage.getItem("userData"));
    let updatedData = { ...data, profilepict };
    localStorage.setItem("userData", JSON.stringify(updatedData));
    dispatch({ type: "PROFILE_UPDATED", payload: { profilepict } });
  };
};
