import * as React from "react"

function getPrevElement(list: HTMLElement[]) {
  const sibling = list[0].previousElementSibling

  if (sibling instanceof HTMLElement) {
    return sibling
  }

  return null
}

function getNextElement(list: HTMLElement[]) {
  const sibling = list[list.length - 1].nextElementSibling

  if (sibling instanceof HTMLElement) {
    return sibling
  }

  return null
}

function usePosition(ref: React.RefObject<HTMLDivElement>) {
  const [prevElement, setPrevElement] = React.useState<HTMLElement | null>(null)
  const [nextElement, setNextElement] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const update = () => {
      const rect = element.getBoundingClientRect()

      const visibleElements = Array.from(element.children).filter((child) => {
        const childRect = child.getBoundingClientRect()

        return childRect.left >= rect.left && childRect.right <= rect.right
      }) as HTMLElement[]

      if (visibleElements.length > 0) {
        setPrevElement(getPrevElement(visibleElements))
        setNextElement(getNextElement(visibleElements))
      }
    }

    update()

    element.addEventListener("scroll", update, {passive: true})

    return () => {
      element.removeEventListener("scroll", update)
    }
  }, [ref])

  const scrollToElement = React.useCallback(
    (element: HTMLElement) => {
      const currentNode = ref.current

      if (!currentNode || !element) return

      const newScrollPosition =
        element.offsetLeft +
        element.getBoundingClientRect().width / 2 -
        currentNode.getBoundingClientRect().width / 2

      currentNode.scroll({
        left: newScrollPosition,
        behavior: "smooth",
      })
    },
    [ref],
  )

  const scrollRight = React.useCallback(() => {
    if (!nextElement) return
    return scrollToElement(nextElement)
  }, [scrollToElement, nextElement])

  const scrollLeft = React.useCallback(() => {
    if (!prevElement) return
    return scrollToElement(prevElement)
  }, [scrollToElement, prevElement])

  return {
    hasItemsOnLeft: prevElement !== null,
    hasItemsOnRight: nextElement !== null,
    scrollRight,
    scrollLeft,
  }
}

const CarouselButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        height: "3rem",
        width: "3rem",
        background: "grey",
        borderRadius: "15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  )
}

const ArrowLeft = ({size, color}: {size: number; color: string}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H6M12 5l-7 7 7 7" />
  </svg>
)

const ArrowRight = ({size, color}: {size: number; color: string}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h13M12 5l7 7-7 7" />
  </svg>
)

// show arrows
// autoplay
// number to show
// loop
// selected index

export default function Carousel({children}: {children: React.ReactNode}) {
  const ref = React.useRef<HTMLDivElement>(null)

  const WIDTH = "20rem"

  const {hasItemsOnLeft, hasItemsOnRight, scrollLeft, scrollRight} =
    usePosition(ref)

  return (
    <div style={{display: "flex"}}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "4em",
          marginRight: "1em",
        }}
      >
        {hasItemsOnLeft && (
          <CarouselButton onClick={scrollLeft} aria-label="Previous slide">
            <ArrowLeft size={30} color="#000000" />
          </CarouselButton>
        )}
      </div>
      <div style={{position: "relative", overflow: "hidden", width: WIDTH}}>
        <div
          ref={ref}
          style={{
            display: "flex",
            overflowX: "scroll",
            scrollbarWidth: "none",
          }}
        >
          {React.Children.map(children, (child, index) => (
            <div style={{flex: "0 0 auto"}} key={index}>
              {child}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "4em",
          marginLeft: "1em",
        }}
      >
        {hasItemsOnRight && (
          <CarouselButton onClick={scrollRight} aria-label="Previous slide">
            <ArrowRight size={30} color="#000000" />
          </CarouselButton>
        )}
      </div>
    </div>
  )
}
