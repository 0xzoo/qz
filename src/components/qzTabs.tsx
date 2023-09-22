import React, { useState, useRef, useContext } from 'react'
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  Box,
  Spinner,
  List,
  ListItem,
  useTabPanel,
  useColorModeValue,
} from '@chakra-ui/react'
import { QCardSmall } from './qCardSmall'
// import { 
//   generatePath, useSearchParams
// } from "react-router-dom"
import { SwipeEventData, useSwipeable } from 'react-swipeable'
// import { InView } from 'react-intersection-observer'
import { 
  CollectionList,
  Query
} from "@polybase/client"
import { RootContext } from '../routes/Root'
import { Qz } from '../types/types'


export type CategoryProps = {
  id: number
  name: string
  tag: string
  loading: boolean
  data: CollectionList<any> | null
  query: Query<Qz>
}

type QzPanelsProps = {
  categories: CategoryProps[]
}

interface CustomTabPanelProps {
  children?: React.ReactNode
  key: number
  id: number
  ref?: React.ForwardedRef<HTMLDivElement>
}

const CustomTabPanel: React.ForwardRefExoticComponent<CustomTabPanelProps> = React.forwardRef<HTMLDivElement, CustomTabPanelProps>((props, ref) => {
  let panelProps = useTabPanel({ ...props, ref })
  panelProps.hidden = false
  panelProps.tabIndex = props.id

  return (
    <Box
      {...panelProps}
      p={[0,4]}
      // borderRight={['.5px solid']}
      w={['100vw', 400, 500]}
      flexShrink={0}
      ref={ref}
      overflowY={'scroll'}
      display={'inline-block'}
    >
      {panelProps.children}
    </Box>
  )
})


export const QzTabs = ({...QzPanelsProps}: QzPanelsProps): React.ReactElement => {
  const [ tabIndex, setTabIndex ] = useState<number>(0)
  const [ translateValue, setTranslateValue ] = useState<number>(0)
  const rootContext = useContext(RootContext)
  const { 
    // qz,
    setQz,
    setSearchParams
  } = rootContext

  const { categories } = QzPanelsProps
  const refs = categories.reduce((acc:{[key: number]: React.RefObject<HTMLDivElement>}, category) => {
    acc[category.id] = useRef(null);
    return acc
  }, {})
  const tabMax = categories.length - 1
  const borderColor = useColorModeValue('gray.300','gray.600')

  const calcTabsTranslate = (index: number) => {
    const vWidth = window.innerWidth
    if (vWidth > 768) {
      return (0 - index * 500)
    } else if (vWidth > 480) {
      return (0 - index * 400)
    } else {
      return (0 - index * vWidth)
    }
  }

  const handleTabsTranslate = (index: number) => {
    const transX = calcTabsTranslate(index)
    setTranslateValue(transX)
  }

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
    handleTabsTranslate(index)
  }

  // function handleScroll (e: React.UIEvent<HTMLDivElement, UIEvent>) {
  //   e.preventDefault()
  //   setTimeout((() => console.log(e)), 1000)
  //   console.log(e)
  // }

  // function handleInView (inView: boolean, entry: any) {
  //   console.log('Inview', inView)
  //   console.log('entry', entry)
  // }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: (e: SwipeEventData) => {
      const dVx = Math.abs(e.vxvy[0])
      const swipeDur = e.absX / dVx
      const minSwipe = (swipeDur < 350) && (dVx > .05)
      const threshd = dVx > .09
      const overHalf = (window.innerWidth / e.absX) < 2
      // console.log('Swipe!', dVx, (dVx / swipeDur), swipeDur, minSwipe)
      if (overHalf || threshd || minSwipe) {
        if (tabIndex !== tabMax) {
          // console.log('Succ',e)
          const newIndex = tabIndex + 1
          setTabIndex(newIndex)
          handleTabsTranslate(newIndex)
          // const transX = calcTabsTranslate(newIndex)
          // console.log(transX)
          // const tP = document.getElementById('TabPanels')
          // tP?.scrollTo(transX, 0)
        }
      }
    },
    onSwipedRight: (e: SwipeEventData) => {
      const dVx = Math.abs(e.vxvy[0])
      const swipeDur = e.absX / dVx
      const minSwipe = (swipeDur < 350) && (dVx > .05)
      const threshd = dVx > .09
      const overHalf = (window.innerWidth / e.absX) < 2
      // console.log('Swipe!', dVx, (dVx / swipeDur), swipeDur, minSwipe)
      if (overHalf || threshd || minSwipe) {
        // console.log('Succ')
        const newIndex = Math.min(tabIndex - 1, 0)
        if (tabIndex) {
          setTabIndex(newIndex)
          handleTabsTranslate(newIndex)
          // const transX = calcTabsTranslate(newIndex)
          // console.log(transX)
          // const tP = document.getElementById('TabPanels')
          // tP?.scrollTo(transX, 0)
        }
      }
    },
    delta: 10,
    // touchEventOptions: { passive: false }
  })
  
  return (
    <Tabs
      isLazy
      lazyBehavior={'keepMounted'}
      index={tabIndex}
      onChange={handleTabsChange}
      colorScheme={'linkedin'}
      h={'100%'}
      display={'flex'}
      flexDir={'column'}
      id="SwipeController"
      overflowX={'hidden'}
      overflowY={'clip'}
      p={0}
      w={['100vw', 400, 500]}
      {...swipeHandlers}
    >
      <TabList
        position={['revert','absolute']}
        top={4}
        left={120}
        flexShrink={0}
        fontFamily={'Poppins, sans-serif'}
      >
        {categories.map((category: CategoryProps) => (
          <Tab
            key={category.id}
            fontSize={['lg','2xl']}
            fontWeight={[400, 500]}
          >
            {category.name.toLowerCase()}
          </Tab>
        ))}
      </TabList>
      <TabPanels
        id="TabPanels"
        display={'flex'}
        flexDir={'row'}
        // overflowX={['scroll', 'revert']}
        overflowY={'clip'}
        transform={'translate(' + translateValue + 'px)'}
        transition={'transform 0.5s ease'}
        // ref={tabPanels}
        // translateX={[0 - tabIndex * window.innerWidth, 0 -  tabIndex * 400, 0 - tabIndex *  500]}
        // scrollSnapType={'x mandatory'}
        // onScroll={handleScroll}
        h={'100%'}
      >
        {categories.map((category: CategoryProps, index: number) => (
          <CustomTabPanel
            key={index}
            id={index}
            ref={refs[index]}
          >
            { category.loading ? (
              <Spinner />
            ) : (
              <List>
                {category.data?.data.map((res: any, i: number) => {

                  const params = { q: res.data.id }
                  const onClick = () => {
                    setSearchParams(params)
                    setQz(category.data?.data)
                  }
                  return (
                    <ListItem key={i}>
                      <QCardSmall borderColor={borderColor} onClick={onClick} q={res.data} />
                    </ListItem>
                  )
                })}
              </List>
            )}
          </CustomTabPanel>
        ))}
      </TabPanels>
    </Tabs>
  )
}