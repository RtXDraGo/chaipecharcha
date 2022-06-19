import React from 'react'
import { Avatar, Box, Tooltip } from '@chakra-ui/react'
import { useContext } from 'react'
import { logincontext } from '../Context/Context'
function Scrolabblechat({message}) {
    const{account,setAccount}=useContext(logincontext);
    const issamesender=(message,m,i,uid)=>{
         return(
             i<message.length-1 && 
                 (message[i+1].sender._id!==m.sender._id ||
                 message[i+1].sender._id===undefined) && message[i].sender._id!==uid
         );
    };
    const islasemsg=(message,i,uid)=>{
     return(
                 i===message.length-1 &&
                 message[message.length-1].sender._id!==uid &&
                 message[message.length-1].sender._id

        
        
        )
    };

    const samesendermargin=(message,m,i,uid)=>{
        if(
            i<message.length-1 && 
            message[i+1].sender._id===m.sender._id &&
             message[i].sender._id!==uid
        )
        return 8;
        else if(
            (i<message.length-1 && 
            message[i+1].sender._id!==m.sender._id &&
            message[i].sender._id!==uid)||
            (i===message.length-1 && message[i].sender._id!==uid)
        )
        return 0;
        else
        return "auto";
    }
const sameuser=(message,m,i)=>{
return i>0 && message[i-1].sender._id===m.sender._id
}
  return (
     <Box>
         {message && message.map((m,i)=>(
             <div style={{display:'flex'}} key={m._id}>
                 {
                     (issamesender(message,m,i,account.uid) || islasemsg(message,i,account.uid)) && (<Tooltip label={m.sender.name} placement={'bottom-start'} hasArrow>
                         <Avatar mt={'7px'} size="sm" cursor={'pointer'} name={m.sender.name} src={m.sender.pic}></Avatar>

                     </Tooltip>)
                 }
                 <span
                 style={{
                    background:`${m.sender._id===account.uid?"#BEE3F8":"#B9F5D0"}`,borderRadius:'20px',padding:'5px',maxWidth:'75%',
                    marginLeft:samesendermargin(message,m,i,account.uid),
                    marginTop:sameuser(message,m,i,account.uid)?3:10
                 }}
                 >
                    {m.content}
                 </span>
             </div>
         ))}
     </Box>
  )
}

export default Scrolabblechat