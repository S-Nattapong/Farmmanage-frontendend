import axios from "axios";


export async function getUser() {
  let result = undefined;

  try {
    var data = {};

    const rs = await axios.post(`http://localhost:4000/users/read`, data);
    if (rs != undefined && rs != null && rs.data != undefined && rs.data != null) {
      result = rs.data;
    } else {
      result = {
        payload: [],
        statusCode: 500,
        message: "Data is invalid",
      };
    }
  } catch (error) {
    result = {
      payload: [],
      statusCode: 500,
      message: "Data is invalid",
    };
  }

  return result;
}
