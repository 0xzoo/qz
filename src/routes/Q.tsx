import React, { useEffect, useState } from "react"
import {
  Stack,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter
} from '@chakra-ui/react'
import { generatePath, useParams } from 'react-router-dom'
import { useQzContext } from '../components/Qz'
import { usePolybase, useDocument } from "@polybase/react"

// generatePath("/users/:id", { id: "42" });

// type QProps = {
//   isLoggedIn: boolean
//   signIn: () => void
// };


export const Q = () => {
  const { isLoggedIn, signIn, account, db } = useQzContext();
  const { qId } = useParams<string>()
  const [response, setResponse] = useState<number>()

  const polybase = usePolybase()
  const { data, error, loading } = useDocument(
    qId ? db.collection('Qz').record(qId) : null,
  )

  const currentQ: any = data?.data;


  const responses: string[] = [];

  const handleResponseClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const key = e.currentTarget.ariaPosInSet as unknown as number
    console.log(key)
    setResponse(key)
  }

  return (
    <>
      {currentQ && (
        <Card minW={'400px'}>
          <CardHeader>
            <Text>{currentQ.stem}</Text>
          </CardHeader>
          <CardBody>
            <Stack>
              {currentQ.az.map((res, i) => {
                return (
                  <Button 
                    color='white'
                    mb={3}
                    key={i}
                    aria-posinset={i}
                    value={res}
                    onClick={handleResponseClick}
                  >
                    {res}
                  </Button>
                )
              })}
            </Stack>
          </CardBody>
        </Card>
      )}
    </>
  )
}