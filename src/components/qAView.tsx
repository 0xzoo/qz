import { Qz } from "../types/types"
import {
  Container,
  Collapse,
  Box,
  Link
} from '@chakra-ui/react'
import { ResponseView } from "./responseView"
import { PrivateToggle } from "./privateToggle"
import { ImportanceSlider } from "./importanceSlider"
import { PublicAzForQ } from "./publicAzForQ"

export enum QAViews {
  RESPOND = 'Respond',
  PUBLIC = 'PublicAz',
  FORKS = 'Forks',
  FUPS = 'FollowUps'
}

type QAViewProps = {
  handleMcRadio: (i: string) => void
  value: string | undefined
  liftValue: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  currentQ: Qz
  initialRef: React.MutableRefObject<null>
  handleIsPrivate: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleImportance: (i: number) => void
  qAView: QAViews
  handleQAViewChange: (view: QAViews) => void
}

export const QAView = (props: QAViewProps) => {

  return (
    <Container
      ml={0}
      my={8}
      minH={'30vh'}
      maxH={'100vh'}
      // overflowY={'hidden'}
    >
      <Collapse in={props.qAView == QAViews.RESPOND}>
        <ResponseView 
          questionType={props.currentQ?.type}
          handleMcRadio={props.handleMcRadio}
          value={props.value}
          liftValue={props.liftValue}
          currentQ={props.currentQ}
          initialRef={props.initialRef}
        />
        <PrivateToggle onChange={props.handleIsPrivate} />
        {props.currentQ?.importance ? (<ImportanceSlider handleImportance={props.handleImportance}/>):('')}
      </Collapse>
      <Collapse in={props.qAView == QAViews.PUBLIC}>
        <Box>
          <Link onClick={() => props.handleQAViewChange(QAViews.RESPOND)}>
            Back
          </Link>
          <PublicAzForQ currentQ={props.currentQ}/>
        </Box>
      </Collapse>
      <Collapse in={props.qAView == QAViews.FORKS}>
        <Box
        >
          <Link onClick={() => props.handleQAViewChange(QAViews.RESPOND)}>
            Back
          </Link>
        </Box>
      </Collapse>
      <Collapse in={props.qAView == QAViews.FUPS}>
        <Box
        >
          <Link onClick={() => props.handleQAViewChange(QAViews.RESPOND)}>
            Back
          </Link>
        </Box>
      </Collapse>
    </Container>
  )
}
