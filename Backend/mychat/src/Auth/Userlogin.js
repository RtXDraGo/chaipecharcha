import React, { useContext } from 'react'
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import { VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { logincontext } from '../Context/Context'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
    FormControl,
    FormLabel,
} from '@chakra-ui/react'
function Userlogin() {
    const {account,setAccount}=useContext(logincontext);
    const navigate=useNavigate()
    const [user, setUser] = useState({
        email: "",
        password: ""
    })
    const handle = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }
    const [show, setShow] = useState(false);
    const handleClick = async() => {

       await axios.post("/login", user)
        .then(
            res => {
                alert(res.data.message)
                setAccount({
                    uid:res.data.user._id,
                    email:res.data.user.email,
                    name:res.data.user.name,
                    pic:res.data.user.pic
                })
            }
        )
        navigate("/home")
    }
    return (
        <>
        <VStack spacing={'10px'}>
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input name='email' id='email' type={'email'} value={user.email} placeholder='Enter your email' onChange={handle}  />
                <FormLabel>Password</FormLabel>
                <InputGroup size='md'>
                    <Input
                        pr='4.5rem'
                        type={show ? 'text' : 'password'}
                        placeholder='Enter password'
                        onChange={handle}
                        name='password'
                        value={user.password}
                        id='password1'
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <Button
                    colorScheme={'blue'}
                    style={{ marginTop: 15 }}
                    width={'70%'}
                    onClick={handleClick}
                >
                    Login
                </Button>
                <Button
                    colorScheme={'red'}
                    style={{ marginTop: 15 }}
                    width={'70%'}

                >
                    Get Login User Credentials
                </Button>
            </FormControl>
        </VStack>
        </>
    )
}

export default Userlogin