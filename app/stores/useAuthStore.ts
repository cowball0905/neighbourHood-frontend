import { defineStore } from 'pinia'
import { getUser, login } from '~/api/auth';
import type { loginParams } from '~/types/common';
import { Storage } from '../utils/storage'

export const useAuthStore = defineStore("auth", {
  state: ()=>({
    isLogin: false,
    userInfo: {
      username: "",
      email: "",
      uuid: "",
      token: ""
    }
  }),
  persist: true,
  actions: {
    async login (request : loginParams) {
      const [error,data,options] = await login(request);
      if(!error&&data){
        this.userInfo.token = data.data
      }
      if(this.userInfo.token){
        const [error,data,options] = await getUser();
        if(!error&&data){
          this.userInfo.username = data.data.username;
          this.userInfo.email = data.data.email;
          this.userInfo.uuid = data.data.uuid
          this.isLogin = true
        }
      }else{
        console.log("login fail")
      }
    },
    async logout(){
      Storage.remove("auth")
    }
  }
});