import React, { useState } from 'react'
import { useContext } from 'react'
import { logincontext } from '../Context/Context'
import { Text, Box, Image, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider, useDisclosure, ModalFooter, ModalHeader, ModalBody, Button, Modal, ModalOverlay, ModalContent, ModalCloseButton, IconButton, useToast, FormControl, Input, Spinner } from '@chakra-ui/react'
import { ViewIcon,CloseIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
function Updategrpchat({fetchmsg}) {
  const navigate=useNavigate();
  const { fetchagain, setFetchagain } = useContext(logincontext)
  const { selectedchat, setSelectedchat } = useContext(logincontext);
  const { account, setAccount } = useContext(logincontext);
  const [grpchatname, setGrpchatname] = useState();
  const toast = useToast();
  const [selectedusers, setSelectedusers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchresult, setSearchresult] = useState([]);
  const [loading, setLoading] = useState(false)
  const [renameload, setRenameload] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleremove = async (delid,loginid) => {
    if (selectedchat.grpadmin._id !== loginid && delid !== loginid) {
      toast({
        title: "Only group admins can onlu remove",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
      return;
    }
    try {
      const { data } = await axios.post("/remove", {
        chatid: selectedchat._id,
        userid: delid
      })
      
      toast({
        title: "User removed successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
      if(delid===loginid)
      {
        setLoading(true)
        setSelectedchat()
        setFetchagain(!fetchagain)
        fetchmsg();
      setLoading(false);
        navigate("/home")
      }
      else
      {
        setFetchagain(!fetchagain)
      setLoading(false);
        setSelectedchat(data);
      } 
      
    } catch (error) {

    }
  }

  const handlerename = async () => {
    if (!grpchatname) {
      return;
    }
    try {
      setRenameload(true)
      const { data } = await axios.post("/renamegrp", {
        name: grpchatname,
        chatid: selectedchat._id
      })
      setSelectedchat(data)
      setFetchagain(!fetchagain)
      setRenameload(false)
      toast({
        title: "Group name updated successfully",
        status: "success",
        duration: '5000',
        isClosable: true,
        position: "top"
      })
    } catch (error) {


    }
    setGrpchatname("")
  }
  const handleSearch = async (val) => {
    setSearch(val)
    if (!val) {
      return
    } try {
      setLoading(true)
      const { data } = await axios.get(`/search/${search}/${account.uid}`)
      setLoading(false)
      setSearchresult(data)
    } catch (error) {

    }
  }
  const handlegrp = async (val) => {
    if (selectedchat.users.find((u) => u._id === val._id)) {
      toast({
        title: "User already added",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
      return;
    }
    if (selectedchat.grpadmin._id !== account.uid) {
      toast({
        title: "Only group admins can add",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
      return;
    }
    try {
      const { data } = await axios.post("/addnew", {
        chatid: selectedchat._id,
        userid: val._id
      })
      setSelectedchat(data)
      setFetchagain(!fetchagain)
      setLoading(false);
      toast({
        title: "User added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
    } catch (error) {

    }
  }
  return (
    <>
      <IconButton onClick={onOpen}
        icon={<ViewIcon></ViewIcon>}
        display={'flex'}
      >Open Modal</IconButton>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={'35px'} justifyContent={'center'} d={'flex'} textAlign={'center'}
          >{selectedchat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display={'flex'}>
              {
                selectedchat.users.map((u) => (
                  <Box
                  key={u._id}
                  onClick={()=>handleremove(u._id,account.uid)}
                    px={2}
                    py={1}
                    borderRadius={'lg'}
                    m={1}
                    mb={2}
                    variant={'solid'}
                    fontSize={'12px'}
                    background={'purple.300'}
                    cursor={'pointer'}
                  >
                    {u.name}
                    <CloseIcon pl={1} />
                  </Box>
                ))
              }
            </Box>
            <FormControl
              display={'flex'}
            ><Input placeholder='New group Name' mb={3} value={grpchatname} onChange={(e) => setGrpchatname(e.target.value)}></Input> <Button
              variant={'solid'}
              colorScheme={'teal'}
              ml={1}
              isLoading={renameload}
              onClick={handlerename}
            >Update</Button></FormControl>
            <FormControl> <Input placeholder='Add users eg: Nil,Nilavhra etc' mb={'3'} onChange={(e) => handleSearch(e.target.value)} /></FormControl>
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
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={()=>handleremove(account.uid,account.uid)} >
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Updategrpchat