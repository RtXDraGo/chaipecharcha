import React, { useState } from 'react'
import { useContext } from 'react';
import { logincontext } from '../Context/Context';
import axios from 'axios';
import { Spinner } from '@chakra-ui/react'
import Userlistitem from './Userlistitem';
import { useToast,Box } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons';
import {Text,Image, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider, useDisclosure, ModalFooter, ModalHeader, ModalBody, Button, Modal, ModalOverlay, ModalContent, ModalCloseButton, FormControl, Input } from '@chakra-ui/react'
function Groupchatmodal({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const[grpchatname,setGrpchatname]=useState();
    const toast=useToast();
    const[selectedusers,setSelectedusers]=useState([]);
    const[search,setSearch]=useState("");
    const[searchresult,setSearchresult]=useState([]);
    const[loading,setLoading]=useState(false)
    const { account, setAccount } = useContext(logincontext);
    const { selectedchat, setSelectedchat } = useContext(logincontext);
    const { chat, setChat } = useContext(logincontext)
    const handleSearch=async(val)=>{
        setSearch(val)
    if (!val) {
      return
    } try {
      setLoading(true)
      const { data } = await axios.get(`/search/${search}/${account.uid}`)
      console.log(data)
      setLoading(false)
      setSearchresult(data)
    } catch (error) {

    }
    }
    const handlesubmit=async()=>{
        const{data}=await axios.post("/groupchat",{
            loginid:account.uid,
            name:grpchatname,
            users:JSON.stringify(selectedusers.map((u)=>u._id))
        })
        setChat([data,...chat]);
        onClose();
        toast({
            title:"New group chat created",
            status:"success",
            duration:'5000',
            isClosable:true,
            position:"top"    
            })
    }
    const handledlt=(userdlt)=>{
        setSelectedusers(
            selectedusers.filter((sel)=>sel._id!==userdlt._id)
        )
    }
    const handlegrp=(usertoadd)=>{
       if(selectedusers.includes(usertoadd))
       {
        toast({
            title:"User already added",
            status:"warning",
            duration:'5000',
            isClosable:true,
            position:"top"
        })
        return;
       }
       setSelectedusers([...selectedusers,usertoadd]);
    }
  return (
    <>
    <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={'35px'} fontFamily={'Work sans'} d="flex" justifyContent={'center'}>Create group chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'} flexDirection="column" alignItems={'center'}>
            <FormControl>
                <Input placeholder='Chat Name' mb={'3'} onChange={(e)=>setGrpchatname(e.target.value)}/>
                <Input placeholder='Add users eg: Nil,Nilavhra etc' mb={'3'} onChange={(e)=>handleSearch(e.target.value)}/>
            </FormControl>
            {loading ? <Spinner /> :
              searchresult.slice(0, 4).map((val) => (
                <Box key={val._id} display={'flex'} mt={'6px'} padding={'6px'}
                  onClick={() => handlegrp(val)}
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
            <Box display={'flex'} flexWrap={'wrap'}>
            {selectedusers.map(val=>(
                 <Box
                 px={2}
                 py={1}
                 borderRadius={'lg'}
                 m={1}
                 mb={2}
                 variant={'solid'}
                 fontSize={'12'}
                 fontWeight={'bold'}
                 bg={'purple.300'}
                 cursor={'pointer'}
                 onClick={()=>handledlt(val)}
                 >
                     {val.name}
                     <CloseIcon pl={1}/>
                 </Box>
            ))} 
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handlesubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </>
  )
}

export default Groupchatmodal