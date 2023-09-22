import { CollectionList } from "@polybase/client"
import { Qz, Az } from "../types/types"
import {
  Stack,
  Box,
  Text,
  useColorModeValue,
  Flex
} from "@chakra-ui/react"


type azBarChartProps = {
  data: CollectionList<Az> | null
  currentQ: Qz
}

export const AzBarChart = (props: azBarChartProps) => {
  const currentQAz = props.currentQ.az as string[]
  const data = props.data?.data

  const currentQAzTally: number[] = Array(currentQAz.length).fill(0)
  if (data) {
    for (let i = 0; i < data.length; i++) {
    const qAz = data[i].data.qIndex as number
    currentQAzTally[qAz] += 1
  }}

  // const barChartData = {
  //   labels: currentQAz,
  //   datasets: [{
  //     data: currentQAzTally
  //   }]
  // }

  // console.log(barChartData)

  return (
    <Stack gap={3}>
      {currentQAz.map((item, i) => {
        const percentage = props.currentQ.pubAz == 0 ? '0%' : (currentQAzTally[i] * 100 / props.currentQ.pubAz).toString() + '%'
        const borderColor = useColorModeValue('gray.700','gray.200')
        const barHolderBg = useColorModeValue('yellow','gray.700')
        const barColor = useColorModeValue('white','teal.600')
        
        return (
        <Box 
          borderWidth='2px'
          borderRadius='md'
          borderColor={borderColor}
          boxShadow='md'
          bg={barHolderBg}
          pos={'relative'}
          h={'56px'}
          key={i}
        >
          <Box
            w={percentage}
            borderRadius='md'
            borderColor={borderColor}
            bgColor={barColor}
            pos={'absolute'}
            top={0}
            bottom={0}
          />
          <Flex
            flexDir={'row'}
            justifyContent={'space-between'}
            px={5}
            py={3}
            pos={'absolute'}
            top={0}
            bottom={0}
            w={'100%'}
          >
            <Text>{item}</Text>
            <Text>{percentage}</Text>
          </Flex>
        </Box>
      )})}
    </Stack>
  )
}