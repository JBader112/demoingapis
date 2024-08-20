import { defineStore } from 'pinia';

export const useTIAccessTokenStore = defineStore('tiaAccessToken', {
  state: () => ({
    accessToken: ''
  }),
  actions: {
    setTIAccessToken(token: string) {
      this.accessToken = token;
    }
  }
});
