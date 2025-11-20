import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/AppFrame.module.css'

const splashScreens = [
  '/splash-1.png',
  '/splash-2.png',
  '/splash-3.png'
]

export default function AppFrame() {
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState(0)

  const handleScreenClick = () => {
    if (currentScreen < splashScreens.length - 1) {
      setCurrentScreen(currentScreen + 1)
    } else {
      router.push('/')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.phoneFrame}>
        <div className={styles.notch} />
        <div className={styles.screen}>
          <div onClick={handleScreenClick} style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
              src={splashScreens[currentScreen]}
              alt={`Screen ${currentScreen + 1}`}
              className={styles.splashImage}
            />
          </div>
          {currentScreen === 0 && (
            <a
              href="https://forms.gle/fhUpHaZemVHwSsTs7"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.waitlistButton}
              onClick={(e) => e.stopPropagation()}
            >
              Join Waitlist
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
