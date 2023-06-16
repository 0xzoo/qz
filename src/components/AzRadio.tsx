import React from 'react'
import {
  useRadio,
  Box,
  useRadioGroup,
  Stack
} from '@chakra-ui/react'


type AzRadioProps = {
  data: string[]
  onChange: (e: any) => void
}

export const AzRadio = ({data, onChange}: AzRadioProps) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "test",
    defaultValue: "two",
    onChange: onChange
  });

  const group = getRootProps();
  return (
    // Surprisingly one doesn't use <RadioGroup> but instead something like <HStack>
    <Stack {...group}>
      {data.map((item, i) => (
        <CustomRadio 
          key={i} 
          {...getRadioProps({ 
            value: item,
            "aria-posinset": i
          })}
        >
          {item}
        </CustomRadio>
      ))}
    </Stack>
  );
}

function CustomRadio(props: any) {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box 
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
        px={5}
        py={3}
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
}




// const RadioCard = (props: any) =>  {
//   const { getInputProps, getRadioProps } = useRadio(props)

//   const input = getInputProps()
//   const checkbox = getRadioProps()

//   return (
//     <Box as='label'>
//       <input {...input} />
//       <Box
//         {...checkbox}
//         cursor='pointer'
//         borderWidth='1px'
//         borderRadius='md'
//         boxShadow='md'
//         _checked={{
//           bg: 'teal.600',
//           color: 'white',
//           borderColor: 'teal.600',
//         }}
//         _focus={{
//           boxShadow: 'outline',
//         }}
//         px={5}
//         py={3}
//       >
//         {props.children}
//       </Box>
//     </Box>
//   )
// }


// export const AzRadio = ({data, onChange}: AzRadioProps) => {
//   const handleChange = (e: any) => {
//     onChange(e)
//   }

//   const { getRootProps, getRadioProps } = useRadioGroup({
//     name: 'framework',
//     defaultValue: 'react',
//     onChange: handleChange,
//   })

//   const group = getRootProps()

//   return (
//     <>
//       {data && data.length > 0 ? (
//         <Stack {...group}>
//           {data.map((res: any, i: number) => {
//             const radio = getRadioProps({i})
//             console.log('i')
//             return (
//               <RadioCard 
//                 color='white'
//                 mb={3}
//                 key={i}
//                 aria-posinset={i}
//                 value={res}
//                 {...radio}
//               >
//                 {res}
//               </RadioCard>
//             )
//           })}
//         </Stack>
//       ):(
//         ''
//       )}
//     </>
//   )
// }