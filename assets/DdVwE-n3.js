import{a}from"./BmlC7b-L.js";async function e(){try{const{data:t,headers:r}=await a.get("/noti/");return[null,t,{headers:r}]}catch(t){return console.error(t),[t,t.response?.status]}}export{e as g};
