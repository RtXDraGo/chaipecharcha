import React from 'react'
import Header from './Header'
import { Box } from '@chakra-ui/react'
import { useContext } from 'react'
import { logincontext } from '../Context/Context'
import Singlechat from './Singlechat'
function Message() {
    const{fetchagain,setFetchagain}=useContext(logincontext)
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
    display={'flex'}>
    <Box display={'flex'} width={'100%'} justifyContent={'space-between'} alignItems={'center'} padding={'5px 10px 5px 10px'}>
    <Header/>
    </Box>
    </Box>
    <Box height={'100vh'}>
    <Box
            flexDir="column"
            alignItems="center"
            p={3}
            bg={'blue.100'}
            w={"50%"}
            borderRadius="lg"
            borderWidth="1px"
            height={"39em"}
            margin={"auto"}
        >
        <Singlechat/>
    </Box>
    </Box>
    </>
  )
}

export default Message