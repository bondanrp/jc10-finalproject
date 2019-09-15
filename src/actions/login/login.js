import axios from "axios";
import swal from "sweetalert2";

export const onLoginUser = (USERNAME, PASSWORD) => {
  return dispatch => {
    axios
      .get(`http://localhost:2019/users`, {
        params: {
          username: USERNAME
        }
      })
      .then(res => {
        if (!res.data.length) {
          swal.fire("Error", "User not found", "error");
        } else {
          axios
            .get(`http://localhost:2019/users`, {
              params: {
                username: USERNAME,
                password: PASSWORD
              }
            })
            .then(res => {
              if (!res.data.length) {
                swal.fire("Error", "Wrong password!", "error");
              } else {
                swal.fire("Success", "User Logged in!", "success");
                let { id, username } = res.data[0];
                localStorage.setItem(
                  "userData",
                  JSON.stringify({ id, username })
                );

                dispatch({
                  type: "LOGIN_SUCCESS",
                  payload: {
                    id,
                    username
                  }
                });
              }
            });
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
