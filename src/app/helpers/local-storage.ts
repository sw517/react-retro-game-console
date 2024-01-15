export const getItemFromLocalStorage = (key: string) => {
  try {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return null;
    return JSON.parse(storedValue);
  } catch (e) {
    return null;
  }
};

export const setItemInLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};
