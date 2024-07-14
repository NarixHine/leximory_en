'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './Fade.module.scss'

function Fade({ children }: { children: React.ReactNode }) {
  const [isVisible, setVisible] = useState(true)
  const [alreadyViewed, setAlreadyViewed] = useState(false)
  const domRef = useRef() as React.MutableRefObject<HTMLInputElement>

  useEffect(() => {
    const currentDomRef = domRef.current
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setVisible(entry.isIntersecting)
        if (entry.isIntersecting) {
          setAlreadyViewed(true)
        }
      })
    })
    observer.observe(currentDomRef)

    return () => observer.unobserve(currentDomRef)
  }, [])

  return (
    <div
      className={`${styles.fadeIntoView} ${isVisible ? styles.isVisible : ''} ${alreadyViewed ? styles.alreadyViewed : ''}`}
      ref={domRef}
    >
      {children}
    </div>
  )
}

export default Fade
