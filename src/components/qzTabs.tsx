import React, { useState, useRef } from 'react'
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  Box,
  Spinner,
  List,
  ListItem,
  Link,
  Flex,
  Text,
  useTabPanel,
} from '@chakra-ui/react'
import { 
  Link as RouterLink,
  generatePath
} from "react-router-dom"
import { useSwipeable } from 'react-swipeable'
// import { InView } from 'react-intersection-observer'
import { CollectionList } from "@polybase/client"


export type CategoryProps = {
  id: number
  name: string
  tag: string
  loading: boolean
  data: CollectionList<any> | null
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
      scrollSnapAlign={'start'}
      ref={ref}
      overflowY={'scroll'}
    >
      {panelProps.children}
    </Box>
  )
})


export const QzTabs = ({...QzPanelsProps}: QzPanelsProps): React.ReactElement => {
  const [ tabIndex, setTabIndex ] = useState<number>(0)
  const { categories } = QzPanelsProps
  const refs = categories.reduce((acc:{[key: number]: React.RefObject<HTMLDivElement>}, category) => {
    acc[category.id] = useRef(null);
    return acc
  }, {})
  const tabMax = categories.length - 1
  // const scrollRef = useRef(null)
  // const scrollSnap = useScrollSnap({ ref: scrollRef, duration: 200, delay: 50 })

  // useEffect(() => {
  //   console.log(tabIndex)

  //   // setTabIndex(tabIndex)
  // },[tabIndex])

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
    refs[index].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
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
    onSwiped: (eventData) => {
      console.log("User Swiped!", eventData)
    },
    onSwipedLeft: () => {
      if (tabIndex !== tabMax) {
        const newIndex = tabIndex + 1
        setTabIndex(newIndex)
      }
    },
    onSwipedRight: (e) => {
      console.log(e)
      const newIndex = Math.min(tabIndex - 1, 0)
      if (tabIndex) setTabIndex(newIndex)
    }
  })
  
  return (
    <Tabs
      isLazy
      lazyBehavior={'keepMounted'}
      index={tabIndex}
      onChange={handleTabsChange}
      h={'100%'}
      display={'flex'}
      flexDir={'column'}
    >
      <TabList
        position={['revert','absolute']}
        top={8}
        left={120}
        zIndex={2001}
        flexShrink={0}
      >
        {categories.map((category: CategoryProps) => (
          <Tab key={category.id}>{category.name}</Tab>
        ))}
      </TabList>

      <Box
        id="SwipeController"
        overflowY={'clip'}
        h={'100%'}
        p={0}
        w={['100vw', 400, 500]}
        {...swipeHandlers}
      >
          
        <TabPanels
          id="TabPanels"
          display={'flex'}
          flexDir={'row'}
          overflowX={['scroll','hidden']}
          overflowY={'clip'}
          scrollSnapType={'x mandatory'}
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
                    const path = generatePath("/q/:qId", { qId: res.data.id })
                    return (
                      <ListItem key={i}>
                        <Link as={RouterLink} to={path}>
                          <Flex
                            direction={'row'}
                            borderBottom='1px solid'
                            borderColor='gray.500'
                            p={3}
                            pt={4}
                            pb={4}
                            justifyContent={'space-between'}
                            w={'100%'}
                          >
                            <Text fontSize='md'>{res.data.stem}</Text>
                            <Text>{res.data.numAz}</Text>
                          </Flex>
                        </Link>
                      </ListItem>
                    )
                  })}
                </List>
              )}
            </CustomTabPanel>
          ))}
        </TabPanels>
      </Box>
    </Tabs>
  )
}