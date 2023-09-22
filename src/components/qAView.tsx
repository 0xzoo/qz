import { Az, Qz } from "../types/types"
import {
  Container,
  Collapse,
  Box
} from '@chakra-ui/react'
import { ResponseView } from "./responseView"
import { PrivateToggle } from "./privateToggle"
import { ImportanceSlider } from "./importanceSlider"
import { PublicAzForQ } from "./publicAzForQ"
import { CollectionRecordResponse } from "@polybase/client"

export enum QAViews {
  RESPOND = 'Respond',
  PUBLIC = 'PublicAz',
  FORKS = 'Forks',
  FUPS = 'FollowUps'
}

type QAViewProps = {
  qIndex: number | undefined
  handleMcRadio: (i: string) => void
  value: string
  handleValue: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  currentQ: Qz
  userAz: CollectionRecordResponse<Az>[] | undefined
  initialRef: React.MutableRefObject<null>
  handleIsPrivate: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleImportance: (i: number) => void
  qAView: QAViews
  handleQAViewChange: (view: QAViews) => void
}

export const QAView = (props: QAViewProps) => {
  return props.currentQ && (
    <Container
      ml={0}
      my={8}
      minH={'30vh'}
      maxH={'100vh'}
      // overflowY={'hidden'}
    >
      <Collapse in={props.qAView == QAViews.RESPOND}>
        <ResponseView 
          handleMcRadio={props.handleMcRadio}
          value={props.value}
          handleValue={props.handleValue}
          currentQ={props.currentQ}
          initialRef={props.initialRef}
          userAz={props.userAz}
        />
        <PrivateToggle onChange={props.handleIsPrivate} />
        {props.currentQ?.importance ? (<ImportanceSlider handleImportance={props.handleImportance}/>):('')}
      </Collapse>
      <Collapse in={props.qAView == QAViews.PUBLIC}>
        <Box>
          <PublicAzForQ currentQ={props.currentQ}/>
        </Box>
      </Collapse>
      <Collapse in={props.qAView == QAViews.FORKS}>
        <Box>

        </Box>
      </Collapse>
      <Collapse in={props.qAView == QAViews.FUPS}>
        <Box>
        </Box>
      </Collapse>
    </Container>
  )
}
