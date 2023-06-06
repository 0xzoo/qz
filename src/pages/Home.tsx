import { useEffect, useState } from 'react'
import { Flex, Heading, Container, Text, Stack, Button, Input, InputGroup, InputLeftAddon, HStack, Avatar } from '@chakra-ui/react'
import { Auth } from '@polybase/auth'
import { ethPersonalSignRecoverPublicKey } from '@polybase/eth'
import { Polybase } from '@polybase/client'
import { useCollection } from '@polybase/react'

const db = new Polybase({
  defaultNamespace: "pk/0x4d5de3518af7848d4997a0749bcdfa49582ba156231afdb227818cf802dc597d593c0faa1604eaa2e0ac3867555cf07fe0c902e1b7893cd7a9b3feb0e4bd1489/Qz",
});

const auth = new Auth();

async function getPublicKey() {
  const msg = 'Login with Chat';
  const sig = await auth.ethPersonalSign(msg);
  const publicKey = ethPersonalSignRecoverPublicKey(sig, msg);
  return '0x' + publicKey.slice(4);
};

export function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [qId, setQId] = useState('');
  // const [publicKey, setPublicKey] = useState<string | null>(null);

  // Query for Qs
  const query = db.collection('Q');
  const { data, error, loading } = useCollection(query);

  const qs: any = data?.data;

  // Handle signIn
  const signIn = async () => {
    const res = await auth.signIn();

    // get public
    let publicKey = res.publicKey;

    if (!publicKey) {
      publicKey = await getPublicKey();
    };

    db.signer(async (data: string) => {
      return {
        h: 'eth-personal-sign',
        sig: await auth.ethPersonalSign(data),
      };
    });

    // Create user if not exists
    try {
      const user = await db.collection('User').record(publicKey).get();
      console.log('User', user);
    } catch (e) {
      await db.collection('User').create([]);
    };

    setIsLoggedIn(!!res);
  };

  // Handle signOut
  const signOut = async () => {
    const res = await auth.signOut();

    setIsLoggedIn(!!res);
  };

  useEffect(() => {
    auth.onAuthUpdate((authState) => {
      setIsLoggedIn(!!authState);

      db.signer(async (data: string) => {
        return {
          h: 'eth-personal-sign',
          sig: await auth.ethPersonalSign(data),
        };
      });
    })
  });

  // Create a new Q
  const createQ = async (stem: string, answers: [string]) => {
    const publicKey = await getPublicKey();
    const timestamp = Date.now();
    await db.collection('Q').create([qId, db.collection('User').record(publicKey), stem, timestamp, answers]);
  };

  return (
    <Flex direction={'column'}>
      <Flex direction={'row'} h={'100vh'} w={'100vw'} p={10}>
        <Stack spacing={8} maxW='30em'>
          <Stack>
            <Heading as='h1'>Qz</Heading>
            {/* <Text>What do you think?</Text> */}
          </Stack>
          <Stack>
            {isLoggedIn ? (
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
                  <Button onClick={createQ}>Create</Button>
                </Stack>
              </Stack>
            ) : (
              <Button onClick={signIn}>Login with Wallet</Button>
            )}
          </Stack>
          {isLoggedIn && (
            <Stack>
              <Heading as='h2' fontSize='2xl'>Logout</Heading>
              <Button onClick={signOut}>Logout</Button>
            </Stack>
          )}
        </Stack >
      </Flex>
    </Flex>
  )
}
