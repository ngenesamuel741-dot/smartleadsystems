import{initializeApp}from"firebase/app";import{getAuth}from"firebase/auth";import{getFirestore}from"firebase/firestore";import{firebaseConfig}from"./config";
let app=null,auth=null,db=null,ok=!firebaseConfig.apiKey.startsWith("PASTE_")&&!firebaseConfig.appId.startsWith("PASTE_");
if(ok){try{app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app)}catch(e){console.error("Firebase init failed:",e);ok=false;app=auth=db=null}}
export const firebaseConfigured=ok;export{app,auth,db};
