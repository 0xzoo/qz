import React from "react"
import { Select } from "@chakra-ui/react"

type QTypeSelectProps = {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  value: string
}

export const QTypeSelect = (props: QTypeSelectProps) => {
  return (
    <Select onChange={props.onChange} value={props.value}>
      <option value='shortText'>Short Text</option>
      <option value='longText'>Long Text</option>
      <option value='mc'>Multiple Choice</option>
      {/* <option value='ranking'>Rank List</option> */}
    </Select>
  )
}