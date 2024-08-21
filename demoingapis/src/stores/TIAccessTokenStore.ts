import { defineStore } from 'pinia';

export const useTIAccessTokenStore = defineStore('tiaAccessToken', {
  state: () => ({
    accessToken: '',
    TIAuth: false,  // Add TIAuth to the store
  }),
  actions: {
    setTIAccessToken(token: string) {
      this.accessToken = token;
    },
    setTIAuth(value: boolean) {  // Add a method to set TIAuth
      this.TIAuth = value;
    }
  }
});
