import React from 'react'
import {Text,Image, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider, useDisclosure, ModalFooter, ModalHeader, ModalBody, Button, Modal, ModalOverlay, ModalContent, ModalCloseButton } from '@chakra-ui/react'
import { useContext } from 'react'
import { logincontext } from '../Context/Context'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { useNavigate } from 'react-router-dom'
function Profilemodal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { account, setAccount } = useContext(logincontext);
    const navigate=useNavigate();
    const logout=()=>{
        navigate("/");
    }
    return (
        <>
            <Menu>
                <MenuButton p={1}>
                    <BellIcon />
                </MenuButton>
            </Menu>
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    <Avatar size={'sm'} cursor={'pointer'} name={account.name} src={account.pic} />
                </MenuButton>
                <MenuList>
                    <MenuItem onClick={onOpen}>My Profile</MenuItem>
                    <Modal size={'lg'} isOpen={isOpen} onClose={onClose} isCentered>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader
                            fontFamily={'Work sans'}
                            textAlign={'center'}
                            >{account.name}</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody
                            textAlign={'center'}
                            alignItems={'center'}
                    
                            >
                                <Image
                                borderRadius="full"
                                boxSize={'150px'}
                                src={account.pic}
                                alt={account.name}
                                margin={'auto'}
                                >

                                </Image>
                                <Text fontSize={{base:"28px" , md:"30px"}} fontStyle={'Work sans'}>
                                    {account.email}
                                </Text>
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='blue' mr={3} onClick={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    <MenuDivider />
                    <MenuItem onClick={logout}>Log Out</MenuItem>
                </MenuList>
            </Menu>
        </>
    )
}

export default Profilemodal