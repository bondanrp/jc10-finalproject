import axios from "axios";
import swal from "sweetalert2";

const urlApiUser = "http://localhost:3001/";

export const onLoginUser = (USERNAME, PASSWORD) => {
  return dispatch => {
    axios
      .get(urlApiUser + "getusername", {
        params: {
          username: USERNAME
        }
      })
      .then(res => {
        let hasil = res.data;
        if (!hasil.length) {
          swal.fire("Error", "User not found", "error");
        } else if (PASSWORD !== hasil[0].password) {
          swal.fire("Error", "Wrong password!", "error");
        } else if (PASSWORD === hasil[0].password) {
          swal.fire(
            "User Logged in!",
            `Welcome ${res.data[0].firstname} ${res.data[0].lastname}`,
            "success"
          );
          let { id, username, role, firstname, lastname } = res.data[0];
          localStorage.setItem(
            "userData",
            JSON.stringify({ id, username, role, firstname, lastname })
          );

          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              id,
              username,
              role,
              firstname,
              lastname
            }
          });
        } else {
          console.log("error");
        }
      });
  };
};

export const onLogOutUser = () => {
  localStorage.clear();

  return {
    type: "LOGOUT_SUCCESS"
  };
};
