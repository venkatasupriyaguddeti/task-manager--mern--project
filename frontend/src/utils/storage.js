// functions - to add the token, get token, delete the token
// session based, token based
//token based - localstorage
//

const KEY = "tm_auth";

export const setAuth = (auth) => {
  localStorage.setItem(KEY, JSON.stringify(auth));
};

export const getAuth = () => {
  const raw = localStorage.getItem(KEY);
  if (!raw)
    //raw - empty string, null, 0, -> false
    return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearAuth = (auth) => {
  localStorage.removeItem(KEY);
};