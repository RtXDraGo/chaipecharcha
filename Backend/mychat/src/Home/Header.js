import React from 'react'
import Profilemodal from './Profilemodal'
import { Box,Image,Text } from '@chakra-ui/react'
function Header() {
    return (
        <>
            <Box display={'flex'}>
                <Image
                    boxSize='30px'
                    objectFit='cover'
                    src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUcahqQ9wKTCOpktZ_99r5V64v3D3kGPQ9Zg&usqp=CAU'}
                />
                <Text fontFamily={'Work sans'}>CHAI-PE-CHARCHA</Text>
            </Box>
            <Box>
                <Profilemodal />
            </Box>
        </>
    )
}

export default Header