import { 
  // Az,
  // Qz,
  QAViewProps,
  QAViews
} from "../types/types"
import {
  Container,
  Collapse,
  Box
} from '@chakra-ui/react'
import { ResponseView } from "./responseView"
import { ImportanceSlider } from "./importanceSlider"
import { PublicAzForQ } from "./publicAzForQ"
// import { CollectionRecordResponse } from "@polybase/client"
// import { PrivacyDrawer } from "./privacyDrawer"
import { PrivacyDropdown } from "./privacyDropdown"

export const QAView = (props: QAViewProps) => {
  const qData = props.currentQ
  return qData && (
    <Container
      // ml={0}
      my={8}
      minH={'30vh'}
      // maxH={'100vh'}
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
        {/* <PrivacyDrawer onChange={props.handleAudience} value={props.audience}/> */}
        <PrivacyDropdown onChange={props.handleAudience} value={props.audience} />
        {qData.importance ? (<ImportanceSlider handleImportance={props.handleImportance}/>):('')}
      </Collapse>
      <Collapse in={props.qAView == QAViews.PUBLIC}>
        <Box>
          <PublicAzForQ currentQ={qData}/>
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
