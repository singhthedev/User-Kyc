//password regexp pattern
export const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;


// email regexp pattern
export const emailValidate = (email: string): boolean => {
  if (String(email).match(/^[A-Za-z0-9._%-]+@(?:[A-Za-z0-9-]+\.)+(com|co\.in|yahoo\.com)$/)) {
    return true;
  } else {
    return false;
  }
};


// generate the mixed api and secret key using this function
export const generateRandomString = (length: number): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }
  return randomString;
};