import React from 'react'
import { createContext,useState } from 'react'
export  const logincontext=createContext(null);
function Context({children}) {
    const [account,setAccount]=useState({
      uid:"",
      email:"",
      name:"",
      pic:""
    })
    const[selectedchat,setSelectedchat]=useState();
    const[chat,setChat]=useState([]);
    const[fetchagain,setFetchagain]=useState(false);
    const[notification,setNotification]=useState([])
  return (
    <logincontext.Provider
    value={{account,setAccount,selectedchat,setSelectedchat,chat,setChat,fetchagain,setFetchagain,notification,setNotification}}>
        {children}
    </logincontext.Provider>
  )
}
export default Context
