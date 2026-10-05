import { create } from 'zustand';

interface TokenStore {
  token: string;
  setToken: (token: string) => void;
  clearToken: () => void;
}

const useTokenStore = create<TokenStore>((set) => ({
  token: '',
  setToken: (token: string) => set(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    return { token };
  }),
  clearToken: () => set(() => {
    localStorage.removeItem('token');
    return { token: '' }
  })
}))

export default useTokenStore;