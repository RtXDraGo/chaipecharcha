import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { logincontext } from '../Context/Context'
import { Box, Center, FormControl, IconButton, Spinner, Text, Tooltip } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { ViewIcon } from '@chakra-ui/icons'
import Updategrpchat from './Updategrpchat'
import Scrolabblechat from './Scrolabblechat'
import { Input,Image, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider, useDisclosure, ModalFooter, ModalHeader, ModalBody, Button, Modal, ModalOverlay, ModalContent, ModalCloseButton } from '@chakra-ui/react'
import io from 'socket.io-client'
import axios from 'axios'
import animationData from './typing.json'
const endpoint="https://chaipecharcha.herokuapp.com/";
var socket,selectedchatcompare;
function Singlechat() {
  
    const { fetchagain, setFetchagain } = useContext(logincontext)
    const{notification,setNotification}=useContext(logincontext)
    const { account, setAccount } = useContext(logincontext);
    const { selectedchat, setSelectedchat } = useContext(logincontext);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [user1, setUser1] = useState({})
    const { chat, setChat } = useContext(logincontext)
    const[message,setMessage]=useState([])
    const[loading,setLoading]=useState(false)
    const[newmsg,setNewmsg]=useState();
    const[socketconnected,setSocketconnected]=useState(false)
    const [typing,setTyping]=useState(false);
    const[istyping,setIstyping]=useState(false)
    const navigate = useNavigate();
    const setback = () => {
        setSelectedchat("")
        navigate("/home")
    }
    const getSender = (uid, users) => {
        return (users[0]._id === uid ? users[1].name : users[0].name)

    }
    const getsenderfull = (uid, users) => {
        onOpen();
        setUser1(users[0]._id === uid ? users[1] : users[0])
    }

    const fetchmsg=async()=>{
        if(!selectedchat)
        return;
        try{
            setLoading(true);
            const {data}=await axios.get(`/fetchallmsg/${selectedchat._id}`);
            setMessage(data)
            setLoading(false)
            socket.emit("join chat",selectedchat._id)
        }catch(Error)
        {

        }
    }
    useEffect(()=>{
        socket=io(endpoint)
        socket.emit("setup",account);
        socket.on('connected',()=>setSocketconnected(true))
        socket.on('typing',()=>setIstyping(true))
        socket.on('stoptyping',()=>setIstyping(false))
    },[])
    const sendmsg=async(event)=>{
        if(event.key==="Enter" && newmsg)
        {
            socket.emit("stoptyping",selectedchat._id)
            try{
                setNewmsg("")
               const {data}=await axios.post("/sendmsg",{
                    content:newmsg,
                    chatid:selectedchat._id,
                    loginid:account.uid
                })
                socket.emit("newmsg",data)
                setMessage([...message,data])
            }catch(Error){
    
            }
        }
    }

    useEffect(()=>{
        fetchmsg();
        selectedchatcompare=selectedchat
    },[selectedchat])

    useEffect(()=>{
        socket.on("msgreceived",(newmsgrcv)=>{
            if(!selectedchatcompare || selectedchatcompare._id !== newmsgrcv.chat._id)
            {
                console.log(selectedchatcompare,newmsgrcv)
                if(!notification.includes(newmsgrcv)){
                    setNotification([newmsgrcv,...notification])
                    setFetchagain(!fetchagain)
                }
            }else{
                setMessage([...message,newmsgrcv])
            }

        })
    })



    const typehandle=(e)=>{
        setNewmsg(e.target.value)
        if(!socketconnected)return;
        if(!typing)
        {
        setTyping(true)
        socket.emit('typing',selectedchat._id) 
        }
        let lasttime=new Date().getTime();
        var timelength=2000
        setTimeout(()=>{
            var timenow=new Date().getTime();
            var timedeff=timenow-lasttime
            if(timedeff>=timelength && typing)
            {
                socket.emit("stoptyping",selectedchat._id)
                setTyping(false)
            }

        },timelength)
    }
    

    return (
        <Box>
            <Box display={'flex'} justifyContent={"space-around"} bg={'purple.200'} borderRadius={'lg'} width={'100%'} boxShadow={'lg'} paddingTop={'10px'}>
                <IconButton
                    icon={<ArrowBackIcon></ArrowBackIcon>}
                    onClick={() => setback()}
                >
                </IconButton>
                <Box>
                <Text fontSize={{ base: "28px", md: "30px" }}
                    pb={3}
                    px={2}
                    fontFamily={'Work sans'}
                    alignItems={'center'}
                    textAlign={'center'}
                >
                    {!selectedchat.isgroupchat ? (<>
                        {getSender(account.uid,selectedchat.users)}
                    </>) :
                        (
                            <>
                            {selectedchat.chatName.toUpperCase()}
                            </>
                        )}
                        {istyping?<Text>typing...</Text>:(<></>)}
                </Text>
                </Box>
                <Box>
                    {
                        !selectedchat.isgroupchat?(<>
                        <Tooltip label="Show user info"><ViewIcon fontSize={'3xl'}
                            cursor={'pointer'} onClick={()=>getsenderfull(account.uid,selectedchat.users)}
                        />

                        </Tooltip>
                        <Modal size={'lg'} isOpen={isOpen} onClose={onClose} isCentered>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader
                                    fontFamily={'Work sans'}
                                    textAlign={'center'}
                                >{user1.name}</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody
                                    textAlign={'center'}
                                    alignItems={'center'}
                                >
                                    <Image
                                        borderRadius="full"
                                        boxSize={'150px'}
                                        src={user1.pic}
                                        alt={user1.name}
                                        margin={'auto'}
                                    >
                                    </Image>
                                    <Text fontSize={{ base: "28px", md: "30px" }} fontStyle={'Work sans'}>
                                        {user1.email}
                                    </Text>
                                </ModalBody>

                                <ModalFooter>
                                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                                        Close
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                        </>):(<><Updategrpchat fetchmsg={fetchmsg}></Updategrpchat></>)
                    }
                </Box>
            </Box>
            <Box
            display={'flex'}
            flexDir={'column'}
            justifyContent={'flex-end'}
            p={3}
            bg={'#E8E8E8'}
            height={'30em'}
            overflowY={'hidden'}
            >
                {loading?(
                    <Spinner size="xl" w={20} h={20} alignSelf="center" margin={'auto'}></Spinner>
                ):(<Box overflowY={'scroll'}><Scrolabblechat message={message}></Scrolabblechat></Box>)}
            </Box>
            <Box >
                <FormControl onKeyDown={sendmsg} isRequired mt={2}>
                    <Input variant={"filled"} bg="#E0E0E0" placeholder='Enter message here' onChange={typehandle} value={newmsg} position={'sticky'}
                    ></Input>
                </FormControl>
            </Box>
        </Box>
    )
}

export default Singlechat