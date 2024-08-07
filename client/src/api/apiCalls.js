import axiosInstance from './axiosInstance';

export const apiCall = async (method, url, data = null) => {
  try {
    
    const response = await axiosInstance({
      method,    
        url,
      data: method === 'delete' ? undefined : data,
    });
    
    return response;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
