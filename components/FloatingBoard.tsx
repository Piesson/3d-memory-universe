import styles from '@/styles/FloatingBoard.module.css'

interface FloatingBoardProps {
  photo: string
  caption: string
  onClick: () => void
  size?: 'normal' | 'small'
  position?: { top?: string, left?: string, right?: string, bottom?: string }
}

export default function FloatingBoard({ photo, caption, onClick, size = 'normal', position }: FloatingBoardProps) {
  const containerStyle = position ? {
    top: position.top,
    left: position.left,
    right: position.right,
    bottom: position.bottom,
    transform: 'none'
  } : undefined

  return (
    <div className={styles.container} onClick={onClick} style={containerStyle}>
      <div className={`${styles.board} ${size === 'small' ? styles.small : ''}`}>
        <div className={styles.photoFrame}>
          <img src={photo} alt={caption} />
        </div>
        <div className={styles.caption}>
          <p>{caption}</p>
          <span className={styles.hint}>Click to hear more</span>
        </div>
      </div>
    </div>
  )
}
