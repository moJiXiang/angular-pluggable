export const LocalStorage = {
  set(key: string, data: string | object) {
    if (typeof data === "object") {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      localStorage.setItem(key, data);
    }
  },

  get(key: string) {
    const data = localStorage.getItem(key);

    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch (error) {
      return data;
    }
  },

  remove(key: string) {
    localStorage.removeItem(key);
  },
};
