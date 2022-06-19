import React from 'react'
import { Box,Image,Text } from '@chakra-ui/react'
function Userlistitem({val,handle}) {
    return (
        <Box key={val._id} display={'flex'} mt={'6px'} padding={'6px'}
            onClick={handle}
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
    )
}

export default Userlistitem