export const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  };
  
  export const addBearer = (token: string) => {
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
};
