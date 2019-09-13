import axios from 'axios'
import swal from 'sweetalert2'

export const onLoginUser = (USERNAME, PASSWORD) => {
    
    return (dispatch) => {
        // Cek di database untuk ketersediaan data username dan password
    axios.get(
        'http://localhost:2019/users',
        {
            params: {
                username: USERNAME,
                password: PASSWORD
            }
        }
    ).then((res) => {
        // Periksa apakah terdapat respon berupa user yang ditemukan
        if(!res.data.length){
            swal.fire('Error','User not found','error')

        } else {
            swal.fire("Success","User Logged in!",'success')
            let {id, username} = res.data[0]
            // Menyimpan data di local storage
            localStorage.setItem(
                'userData',
                JSON.stringify({id, username})
            )
  
            

            // Meyimpan / mengirim data di redux state
            dispatch(
                {
                    type: 'LOGIN_SUCCESS',
                    payload: {
                        id, username
                    }
                }
            )
            
        }
    })
    }

}

export const onLogOutUser = () => {
    // Menghapus data di local storage
    localStorage.clear()

    // Menghapus data di redux, tidak memerlukan payload
    return {
        type: 'LOGOUT_SUCCESS'
    }
}
