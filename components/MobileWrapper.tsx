import { ReactNode } from 'react'
import styles from '@/styles/AppFrame.module.css'

interface MobileWrapperProps {
  children: ReactNode
  showFrame?: boolean
}

export default function MobileWrapper({ children, showFrame = true }: MobileWrapperProps) {
  if (!showFrame) {
    return <>{children}</>
  }

  return (
    <div className={styles.container}>
      <div className={styles.phoneFrame}>
        <div className={styles.notch} />
        <div className={styles.screen}>
          <div className={styles.appContent}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
