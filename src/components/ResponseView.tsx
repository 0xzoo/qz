import React from 'react'
import {
  FormControl,
  FormLabel,
  Stack,
  Flex,
  Textarea,
  Input,
  Button
} from '@chakra-ui/react'

type responseViewProps = {
  type: string
  responses: string[]
  onResponseInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  onAddResponse: (e: React.MouseEvent<HTMLButtonElement>) => void
  onAddImportance: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const shortTextPlaceholder = "Short text responses can be up to 255 characters, or a little bit less than the max length of a tweet. This is an example. Perfect for when you want responders to be brief, or for tfw \"I ain't reading all that. I'm happy for u tho. Or sorry that happened\""

const longTextPlaceholder = "Long text responses can be up to 3000 characters, or about as long as the average page of text. We might change the max length in the future depending on storage costs, but this should be enough to go more in depth in a response.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Malesuada fames ac turpis egestas sed tempus urna et pharetra. Odio facilisis mauris sit amet massa vitae tortor. Ultrices in iaculis nunc sed augue lacus viverra vitae. Viverra adipiscing at in tellus integer feugiat scelerisque. Ac felis donec et odio pellentesque diam. Congue nisi vitae suscipit tellus mauris a. Morbi tristique senectus et netus et malesuada fames ac turpis. Faucibus nisl tincidunt eget nullam. Arcu ac tortor dignissim convallis. Eget egestas purus viverra accumsan in nisl nisi scelerisque eu. Eu lobortis elementum nibh tellus molestie. Tellus at urna condimentum mattis pellentesque id nibh tortor. Dignissim sodales ut eu sem integer vitae justo. Vel pretium lectus quam id.\
Fringilla est ullamcorper eget nulla facilisi. Volutpat est velit egestas dui id ornare. Nunc lobortis mattis aliquam faucibus purus in massa tempor. Vel quam elementum pulvinar etiam. Sit amet purus gravida quis blandit turpis. Egestas congue quisque egestas diam in arcu. Tincidunt tortor aliquam nulla facilisi cras fermentum odio eu feugiat. Iaculis urna id volutpat lacus. Egestas dui id ornare arcu odio ut. Sed risus ultricies tristique nulla aliquet. Lectus arcu bibendum at varius vel pharetra.\n\nNullam vehicula ipsum a arcu cursus vitae. Diam ut venenatis tellus in metus vulputate eu scelerisque felis. Interdum consectetur libero id faucibus nisl tincidunt eget nullam. Sed turpis tincidunt id aliquet. Ipsum a arcu cursus vitae congue mauris rhoncus aenean vel. Interdum varius sit amet mattis. Pharetra massa massa ultricies mi quis hendrerit dolor magna. Viverra vitae congue eu consequat ac felis donec et odio. Fermentum et sollicitudin ac orci phasellus egestas tellus. Ut eu sem integer vitae justo eget magna. Ut aliquam purus sit amet luctus. Lacus sed viverra tellus in. Faucibus ornare suspendisse sed nisi lacus. Pulvinar pellentesque habitant morbi tristique. Enim neque volutpat ac tincidunt vitae semper quis. Aliquam ut porttitor leo a diam sollicitudin tempor.\n\nNulla facilisi etiam dignissim diam. Ullamcorper sit amet risus nullam eget. Amet porttitor eget dolor morbi non arcu risus. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. Mollis aliquam ut porttitor leo a diam sollicitudin tempor id. Aenean euismod elementum nisi quis eleifend quam adipiscing vitae proin. Malesuada nunc vel risus commodo viverra maecenas. Tempor orci dapibus ultrices in iaculis nunc sed augue lacus. Accumsan lacus vel facilisis volutpat est velit egestas dui id. Rhoncus aenean vel elit scelerisque mauris pellentesque. Leo urna molestie at elementum."

export const ResponseView = (props: responseViewProps) => {
  switch(props.type) {
    case 'mc':
      return (
        <FormControl>
          <FormLabel>Responses</FormLabel>
          {props.responses.map((res, i) => {
            return (
              <Input 
                placeholder= {res}
                color='white'
                type='text'
                mb={3}
                key={i}
                aria-posinset={i}
                _placeholder={{
                  opacity: .7,
                  color: 'inherit'
                }}
                onChange={props.onResponseInput}
              />
            )
          })}
          <Flex direction={'row'} justifyContent={'space-between'}>
            <Button onClick={props.onAddResponse}>+</Button>
            <Button onClick={props.onAddImportance}>Add Importance</Button>
          </Flex>
        </FormControl>
      )
    case 'shortText':
      return (
        <FormControl>
          <FormLabel>Example Response</FormLabel>
          <Stack>
            <Textarea
              isReadOnly
              minH={'100px'} 
              defaultValue={shortTextPlaceholder}
            />
          </Stack>
        </FormControl>
      )
    case 'longText':
      return (
        <FormControl>
          <FormLabel>Example Response</FormLabel>
          <Stack>
          <Textarea
              isReadOnly
              minH={'100px'} 
              defaultValue={longTextPlaceholder}
            />
          </Stack>
        </FormControl>
      )
  }
}