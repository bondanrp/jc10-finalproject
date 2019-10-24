import axios from "axios";
import swal from "sweetalert2";
import { encrypt } from "../../functions/index";

const urlApiUser = "http://localhost:3001/";

export const onLoginUser = (USERNAME, PASSWORD) => {
  return dispatch => {
    axios
      .get(urlApiUser + "login", {
        params: {
          username: USERNAME,
          password: encrypt(PASSWORD)
        }
      })
      .then(res => {
        let hasil = res.data.result;
        if (res.data.status === "404" || res.data.status === "401") {
          let errMsg = res.data.message;
          swal.fire("Error", errMsg, "error");
        } else if (res.data.status === "200") {
          swal.fire({
            title: "User Logged in!",
            html: `<p class='text-capitalize'>Welcome ${hasil[0].firstname} ${hasil[0].lastname}</p>`,
            type: "success"
          });
          let {
            id,
            username,
            role,
            firstname,
            lastname,
            profilepict,
            premium
          } = hasil[0];
          localStorage.setItem(
            "userData",
            JSON.stringify({
              id,
              username,
              role,
              firstname,
              lastname,
              profilepict,
              premium
            })
          );

          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              id,
              username,
              role,
              firstname,
              lastname,
              profilepict,
              premium
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
