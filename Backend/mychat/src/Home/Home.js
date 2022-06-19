import React from 'react'
import { Menu,MenuButton,Tooltip, Container, Box, Text, Tabs, Tab, TabList, TabPanels, TabPanel, Image, Input, Button, VStack, StackDivider, Drawer, DrawerOverlay, DrawerContent, DrawerBody, DrawerHeader, MenuList, MenuItem, MenuDivider, color } from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios'
import { useDisclosure } from '@chakra-ui/react'
import { useContext } from 'react'
import { logincontext } from '../Context/Context'
import Chatpage from './Chatpage'
import Header from './Header'
import { CloseIcon } from '@chakra-ui/icons'
function Home() {
    const [search, setSearch] = useState("")
    const [result, setResult] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [placement, setPlacement] = useState('left')
    const { account, setAccount } = useContext(logincontext);
    const{selectedchat,setSelectedchat}=useContext(logincontext);
    const{chat,setChat}=useContext(logincontext)
    const handle = e => {
        setSearch(e.target.value);
    }
    const submitclick =async() => {
        onOpen();
        const {data}=await axios.get(`/search/${search}/${account.uid}`)
        setResult(data)
    }
    const handlefunc=async(uidd)=>{
        const {data}=await axios.post('/accesschat',{
            loginid:account.uid,
            newuserid:uidd
        })
        onClose();
        if(!chat.find((c)=>c._id===data._id))setChat([data,...chat])
    }
    return (
        <>
            <Box
                color={'black'}
                bg={'whatsapp.100'}
                width={'100%'}
                fontSize={'20px'}
                fontStyle={'oblique'}
                margin={'20px auto'}
                borderRadius={'8px'}
                fontWeight={'semibold'}
                p={'4'}
                display={'flex'}
            >
                <Box display={'flex'} width={'100%'} justifyContent={'space-between'} alignItems={'center'} padding={'5px 10px 5px 10px'}>
                    <Box>
                        <Input width='50%' border={'4px solid blue'} placeholder="Search an user" name="search" value={search} onChange={handle} />
                        <Tooltip label="Search user to chat" hasArrow placement='bottom-end'>
                            <Button variant={'solid'} onClick={()=>submitclick()}>
                                Search
                            </Button>
                        </Tooltip>
                        <Drawer placement={placement} isOpen={isOpen}>
                            <DrawerOverlay />
                            <DrawerContent>
                                <DrawerHeader borderBottomWidth='1px'>Users List<CloseIcon onClick={()=>onClose()} cursor={'pointer'}></CloseIcon></DrawerHeader>
                                <DrawerBody>
                                    <VStack
                                        divider={<StackDivider borderColor='gray.200' />}
                                        spacing={4}
                                        align='stretch'
                                    >

                                        {
                                
                                             result && result.map((val) => (
                                                <Box key={val._id} display={'flex'} mt={'6px'} padding={'6px'}
                                                onClick={()=>handlefunc(val._id)}
                                                cursor={'pointer'}
                                                bg={'#E8E8E8'}
                                                borderRadius={'30px'}
                                                _hover={{
                                                    background: '#38B2AC',
                                                    color: 'white'
                                                }}
                                                width={'100%'}
                                            >
                                                <Image src={val.pic} boxSize={'50px'} borderRadius={'50%'} mr={'5px'}></Image>
                                                <Box>
                                                    <Text fontWeight={'bold'}>{val.name}</Text>
                                                    <Text>{val.email}</Text>
                                                </Box>
                                            </Box>
                                            ))
                                        }
                                    </VStack>
                                </DrawerBody>
                            </DrawerContent>
                        </Drawer>
                    </Box>
                    <Header/>
                </Box>
            </Box>
            <Box height={'100vh'}>
                <Chatpage></Chatpage>
            </Box>
        </>
    )
}

export default Home