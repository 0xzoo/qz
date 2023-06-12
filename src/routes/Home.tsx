import { useState } from 'react';
import { 
  Flex,
  Heading,
  Link,
  List,
  Container,
  Text,
  Stack,
  Button,
} from '@chakra-ui/react'
// import { Polybase } from '@polybase/client';
import { useCollection } from '@polybase/react'
import { Link as RouterLink, generatePath, useParams } from "react-router-dom";
import { useRootContext } from './Root'
// import { useIsLoggedIn, LoaderData, loader } from './Root'
import { CreateQModal } from '../components/createQ';

export function Home() {
  const { isLoggedIn, signIn, account, db } = useRootContext();
  // const [activeQ, setactiveQ] = useState('');
  // let { qId } = useParams()
  // if (!!qId) setactiveQ(qId)
  // console.log(activeQ)

  // Query for Qs
  const query = db.collection('Qz').sort('timestamp', 'desc');
  const { data, error, loading } = useCollection(query);

  const newQz: any = data?.data;

  // <Stack spacing={8} maxW='30em'>
  //     <Stack>
  //       {isLoggedIn && (
  //         <Stack >
  //           < Heading as='h2' fontSize='2xl'>Qs</Heading>
  //           {qs?.map(() => {
  //             return (
  //               <Stack maxW='30em'>
  //                 <HStack border='1px solid' borderColor='gray.100' borderRadius='md' p={4}>
  //                   <Avatar size='sm' name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
  //                   <Heading fontSize='lg'>@id</Heading>
  //                 </HStack>
  //               </Stack>
  //             )
  //           })}
  //           <Stack>
  //             <Heading as='h2' fontSize='md'>Mint a new Q</Heading>
  //             <InputGroup>
  //               <InputLeftAddon children='@' />
  //               <Input onChange={(e) => setQId(e.target.value)} />
  //             </InputGroup>
  //             <Button>Create</Button>
  //           </Stack>
  //         </Stack>
  //       )}
  //     </Stack>
  //   </Stack >

  return (
    <Flex direction={'column'} h={'100%'} w={'100vw'} justifyContent={'space-between'} p={10}>
      <Flex direction={'row'} h={'80%'} w={'100%'} justifyContent={'space-around'}>
        <Stack spacing={8} w='40%' maxW='50em' h='80%'>
          <Heading as={'h2'} fontSize={'2xl'}>New Qz</Heading>
          <Flex direction={'column'} justifyContent={'flex-start'}>
            <List>
              {newQz?.map((res, i) => {
                const path = generatePath("/q/:qId", { qId: res.data.id });
                return (
                  <Link as={RouterLink} to={path} key={i}>
                    <Flex direction={'row'} border='1px solid' borderColor='gray.100' p={4} justifyContent={'space-between'}>
                      <Text fontSize='lg'>{res.data.stem}</Text>
                      <Text>{res.data.numAz}</Text>
                    </Flex>
                  </Link>
                )
              })}
            </List>
          </Flex>
        </Stack>
        <Stack spacing={8} w='40%' maxW='50em' h='80%'>
          <Heading as={'h2'} fontSize={'2xl'}>Pop Qz</Heading>
        </Stack>
      </Flex>
      <Flex w='100%' justifyContent={'center'}>
        <CreateQModal isLoggedIn={!!isLoggedIn} signIn={signIn} />
      </Flex>
    </Flex>
  )
}
