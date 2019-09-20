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
        console.log(!PASSWORD === hasil[0].password);
        console.log(PASSWORD === hasil[0].password);
        if (!hasil.length) {
          swal.fire("Error", "User not found", "error");
        } else if (PASSWORD !== hasil[0].password) {
          swal.fire("Error", "Wrong password!", "error");
        } else if (PASSWORD === hasil[0].password) {
          swal.fire("Success", "User Logged in!", "success");
          let { id, username, role } = res.data[0];
          localStorage.setItem(
            "userData",
            JSON.stringify({ id, username, role })
          );

          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              id,
              username,
              role
            }
          });
        } else {
          console.log("semua false");
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
