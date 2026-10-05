import React,{Component}from"react";
import{createRoot}from"react-dom/client";
import{BrowserRouter}from"react-router-dom";
import{HelmetProvider}from"react-helmet-async";
import App from"./App";
import"./styles.css";
import"./site.css";

class AppErrorBoundary extends Component{
  constructor(props){super(props);this.state={error:null}}
  static getDerivedStateFromError(error){return{error}}
  componentDidCatch(error,info){console.error("Smart Lead Systems render error:",error,info)}
  render(){
    if(this.state.error){
      return <div style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:24,fontFamily:"system-ui",background:"#F7F8F5",color:"#101821"}}>
        <div style={{maxWidth:620,textAlign:"center"}}>
          <strong style={{fontSize:12,letterSpacing:".12em"}}>SMART LEAD SYSTEMS</strong>
          <h1 style={{fontSize:"clamp(36px,7vw,64px)",lineHeight:1,margin:"18px 0"}}>Something went wrong while loading the site.</h1>
          <p style={{color:"#66717d",lineHeight:1.7}}>Refresh the page. If you are running the project locally in Acode or SPCK, start the Vite server instead of opening index.html directly.</p>
          <button onClick={()=>location.reload()} style={{border:0,background:"#064797",color:"#fff",padding:"13px 18px",fontWeight:800,cursor:"pointer"}}>Reload site</button>
        </div>
      </div>
    }
    return this.props.children
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </HelmetProvider>
    </AppErrorBoundary>
  </React.StrictMode>
);
