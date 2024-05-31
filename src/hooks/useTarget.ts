import { useState, useEffect, useRef } from 'react'

const useTarget = (initialIsTarget: boolean, useContextMenu?: boolean) => {
  const [isTarget, setIsTarget] = useState(initialIsTarget)

  const ref = useRef(null)

  const handleClickOutside = (event: Event) => {
    // @ts-expect-error - TS complains about ref.current being null, but it's just to prevent a React bug
    if (ref.current && !ref.current.contains(event.target)) {
      setIsTarget(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    if (useContextMenu) {
      document.addEventListener('contextmenu', handleClickOutside, true)
    }
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
      useContextMenu ? document.removeEventListener('contextmenu', handleClickOutside, true) : null
    }
  }, [])

  return { ref, isTarget, setIsTarget }
}

export default useTarget
