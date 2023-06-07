import { useState } from 'react';
import { Flex, Heading, Container, Text, Stack, Button, Input, InputGroup, InputLeftAddon, HStack, Avatar } from '@chakra-ui/react'
import { Polybase } from '@polybase/client';
import { useCollection } from '@polybase/react'
import { useLoaderData } from "react-router-dom"
import { useIsLoggedIn } from './Root'
// import { useIsLoggedIn, LoaderData, loader } from './Root'

export function Home() {
  const { isLoggedIn } = useIsLoggedIn();
  const [qId, setQId] = useState('');

  // const db = useLoaderData() as Polybase
  const db = new Polybase({ defaultNamespace: "pk/0x4d5de3518af7848d4997a0749bcdfa49582ba156231afdb227818cf802dc597d593c0faa1604eaa2e0ac3867555cf07fe0c902e1b7893cd7a9b3feb0e4bd1489/Qz"})

  // Query for Qs
  const query = db.collection('Q');
  const { data, error, loading } = useCollection(query);

  const qs: any = data?.data;

  // Create a new Q
  const createQ = async (stem: string, answers: [string]) => {
    const publicKey = await getPublicKey();
    const timestamp = Date.now();
    await db.collection('Q').create([qId, db.collection('User').record(publicKey), stem, timestamp, answers]);
  };

  return (
    <Flex direction={'column'} h={'100vh'} w={'100vw'} p={10}>
      <Flex direction={'row'} h={'80%'} w={'100%'} justifyContent={'space-around'}>
        <Stack spacing={8} w='40%' maxW='50em' h='80%'>
          <Heading as={'h2'} fontSize={'2xl'}>New Qz</Heading>
        </Stack>
        <Stack spacing={8} w='40%' maxW='50em' h='80%'>
          <Heading as={'h2'} fontSize={'2xl'}>Pop Qz</Heading>
        </Stack>
      </Flex>
      <Flex w='100%' justifyContent={'center'}>
        <Button>Create a New Qz</Button>
      </Flex>
      {/* <Stack spacing={8} maxW='30em'>
        <Stack>
          {isLoggedIn && (
            <Stack >
              < Heading as='h2' fontSize='2xl'>Qs</Heading>
              {qs?.map(() => {
                return (
                  <Stack maxW='30em'>
                    <HStack border='1px solid' borderColor='gray.100' borderRadius='md' p={4}>
                      <Avatar size='sm' name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
                      <Heading fontSize='lg'>@id</Heading>
                    </HStack>
                  </Stack>
                )
              })}
              <Stack>
                <Heading as='h2' fontSize='md'>Mint a new Q</Heading>
                <InputGroup>
                  <InputLeftAddon children='@' />
                  <Input onChange={(e) => setQId(e.target.value)} />
                </InputGroup>
                <Button>Create</Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack > */}
    </Flex>
  )
}
