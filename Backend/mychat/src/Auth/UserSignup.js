import React from 'react'
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import { VStack ,useToast} from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios'
import {
    FormControl,
    FormLabel,
} from '@chakra-ui/react'
function UserSignup() {
    const [image, setImage] = useState("")
    const [loading,setLoading]=useState(false)
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: "",
    })
    const handle = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }
    const [show, setShow] = useState(false);
    const toast = useToast()

//set pic
const postDetails=async(pics)=>{
    setLoading(true);
    if(pics===undefined)
    {
        toast({
            title: 'Please select an image',
            status: 'warning',
            duration: 8000,
            isClosable: true,
            position:'bottom'
          })
          return;
    }
    const formData = new FormData();
        formData.append("file", pics);
        formData.append("upload_preset", "chatapp")
         await axios.post("https://api.cloudinary.com/v1_1/dqfzaticp/image/upload", formData).then((res) => {
            setImage(res.data.url)
            setLoading(false)
        })
}


    const handleClick = async () => {
        const { password, cpassword } = user;
        if (password != cpassword)
            alert("password do not match")
        else {
           await axios.post("/register", {
                data1:
                {
                    user,
                    image
                }
            })
                .then(res => {
                    alert(res.data.message)
                    console.log(res.data)
                })
        }
    }

    return (
        <VStack spacing={'10px'}>
            <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input name='name' value={user.name} placeholder='First name' onChange={handle} id='name' />
                <FormLabel>Email</FormLabel>
                <Input name='email' type={'email'} value={user.email} placeholder='Enter your email' onChange={handle} />
                <FormLabel>Password</FormLabel>
                <InputGroup size='md'>
                    <Input
                        pr='4.5rem'
                        type={show ? 'text' : 'password'}
                        placeholder='Enter password'
                        onChange={handle}
                        name='password'
                        value={user.password}
                        id='password'
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size='md'>
                    <Input
                        pr='4.5rem'
                        type={show ? 'text' : 'password'}
                        placeholder='Retype password'
                        name='cpassword'
                        value={user.cpassword}
                        onChange={handle}
                        id='cpassword'

                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' >
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <FormLabel>Upload your picture</FormLabel>
                <Input id='pic'
                    type={'file'}
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => {
                        postDetails(e.target.files[0])
                    }}
                    name='pic'
                    value={user.picture}
                >
                </Input>
                <Button
                    colorScheme={'blue'}
                    style={{ marginTop: 15 }}
                    width={'70%'}
                    onClick={handleClick}
                    isLoading={loading}
                >
                    Signup
                </Button>
            </FormControl>
        </VStack>
    )
}

export default UserSignup