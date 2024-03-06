import axios from "axios"

export const getList = async (share_id: string, file_id: string) => {
  let res
  try {
    const res = await axios.get('/api/aliyundrive/list', { params: { share_id, file_id } })
    return res.data.message
  } catch (error) {
    console.log(error);
    
    return []
  }
}