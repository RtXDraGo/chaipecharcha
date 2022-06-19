import axios from 'axios';
import React, { useEffect } from 'react'
import { useContext } from 'react'
import { logincontext } from '../Context/Context'
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Groupchatmodal from './Groupchatmodal';
import { useNavigate } from 'react-router-dom';
function Chatpage() {
    const { account, setAccount } = useContext(logincontext);
    const { selectedchat, setSelectedchat } = useContext(logincontext);
    const { chat, setChat } = useContext(logincontext)
    const { fetchagain, setFetchagain } = useContext(logincontext)
    const navigate = useNavigate();
    const fetchchat = () => {
        axios.get(`/fetchchat/${account.uid}`)
            .then(res => setChat(res.data))
    }
    useEffect(() => {
        fetchchat();
    }, [fetchagain]);

    const getSender = (uid, users) => {
        return (users[0]._id === uid ? users[1].name : users[0].name)

    }
    const setmsg = (chat) => {
        setSelectedchat(chat)
        navigate("/message");

    }
    
    return (

        <Box
            flexDir="column"
            alignItems="center"
            p={3}
            bg={'blue.100'}
            w={{ base: "70%" }}
            borderRadius="lg"
            borderWidth="1px"
            height={"80%"}
            margin={"auto"}
            overflowY={'scroll'}
        >
            <Box display={'flex'} justifyContent={'space-between'}>
                <Text fontSize={'30px'}>MyChat</Text>
                <Groupchatmodal>
                    <Button
                        d="flex"
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}>
                        New Group chat
                    </Button>
                </Groupchatmodal>
            </Box>
            <Stack overflowY={'scroll'} mt={'10px'}>
                {
                    chat && chat.map((chat) => (
                        <Box
                            cursor={'pointer'}
                            px={3}
                            py={2}
                            _hover={{
                                background: '#38B2AC',
                                color: 'white'
                            }}
                            borderRadius={'lg'}
                            key={chat._id}
                            onClick={() => setmsg(chat)}

                        >
                            <Text fontSize={'20px'} fontWeight={'bold'}>
                                {
                                    !chat.isgroupchat ? getSender(account.uid, chat.users) :
                                        chat.chatName
                                }

                                
                            </Text>
                            <Text fontSize={'15px'} fontWeight={'600'} color={'gray.500'}>{chat.latestmsg?chat.latestmsg.sender.name + ":" + chat.latestmsg.content:"No message yet"}</Text>
                        </Box>
                    ))
                }
            </Stack>

        </Box>
    )
}

export default Chatpage