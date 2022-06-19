import React from 'react'
import { Container, Box, Text, Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react'
import Userlogin from './Auth/Userlogin'
import UserSignup from './Auth/UserSignup'
import { Image } from '@chakra-ui/react'
function Login() {
    return (
        <Container maxW='2xl' height={'100vh'} centerContent>
            <Box
                color={'black'}
                bg={'whatsapp.100'}
                width={'100%'}
                fontSize={'30px'}
                fontStyle={'oblique'}
                margin={'40px 0px 15px 0px'}
                justifyContent={'center'}
                textAlign={'center'}
                borderRadius={'8px'}
                fontWeight={'semibold'}
                p={'4'}
                display={'flex'}
            >
                <Image
                    boxSize='50px'
                    objectFit='cover'
                    src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUcahqQ9wKTCOpktZ_99r5V64v3D3kGPQ9Zg&usqp=CAU'}
                />
                <Text fontFamily={'Work sans'}>CHAI-PE-CHARCHA</Text>
            </Box>
            <Box bg={'blue.100'}
                p={'4'}
                width={'100%'}
                borderRadius={'8px'}
            >
                <Tabs variant='soft-rounded' colorScheme='green'>
                    <TabList
                        mb={'1em'}
                    >
                        <Tab width={'50%'} fontSize={'2xl'}>Login</Tab>
                        <Tab width={'50%'} fontSize={'2xl'}>Signup</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <p><Userlogin></Userlogin></p>
                        </TabPanel>
                        <TabPanel>
                            <p><UserSignup></UserSignup></p>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default Login