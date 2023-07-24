import {
  useState,
  useRef,
  useEffect
} from 'react'
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  Flex,
  Box
} from '@chakra-ui/react'

interface ScrollableTabProps {
    headers: string[]
    content: JSX.Element[]
}

export function ScrollableTab(props: ScrollableTabProps): JSX.Element {
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState<number | null>(null)
    const [scrollLeft, setScrollLeft] = useState(0)

    const [tabIndex, setTabIndex] = useState(0)

    const tabListRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', mouseMoveHandler)
            document.addEventListener('mouseup', mouseUpHandler)
        }
    }, [isDragging])

    function tabChangeHandler(index: number) {
        const scrollOffset = scrollLeft - tabListRef.current!.scrollLeft

        if (Math.abs(scrollOffset) <= 15 && Math.abs(scrollOffset) >= 0) {
            setTabIndex(index)
        }
    }

    function mouseDownHandler(e: React.MouseEvent<HTMLDivElement>) {
        setIsDragging(true)
        setStartX(e.pageX)
        setScrollLeft(tabListRef.current!.scrollLeft)
    }

    function mouseMoveHandler(e: MouseEvent) {
        if (!isDragging) {
            return
        }

        const delta = e.pageX - (startX ?? 0)
        tabListRef.current!.scrollLeft = scrollLeft - delta
    }

    function mouseUpHandler() {
        setIsDragging(false)

        document.removeEventListener('mousemove', mouseMoveHandler)
        document.removeEventListener('mouseup', mouseUpHandler)
    }

    return (
        <Tabs isManual={true} isLazy={true} variant="unstyled" onChange={tabChangeHandler} index={tabIndex}>
            <TabList
                ref={tabListRef}
                onMouseDown={mouseDownHandler}
                overflowY="scroll"
                sx={{
                    "::-webkit-scrollbar": {
                        display: "none"
                    }
                }}
            >
                {props.headers.map((header, index) => (
                    <Flex flexDirection="column">
                        <Tab 
                            key={index} 
                            height="40px" 
                            width="55px" 
                            alignItems="center"
                            justifyContent="center"
                            textColor={tabIndex === index ? "blue.500" : ""}
                        >
                            {header}
                        </Tab>
                        {tabIndex === index && (
                            <Box width="100%" height="3px" background={tabIndex === index ? "blue.500" : ""} />
                        )}
                    </Flex>
                ))}
            </TabList>
            
            <TabPanels>
                {props.content.map((jsx) => (
                    jsx
                ))}
            </TabPanels>
        </Tabs>
    )
}