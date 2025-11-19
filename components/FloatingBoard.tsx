import styles from '@/styles/FloatingBoard.module.css'

interface FloatingBoardProps {
  photo: string
  caption: string
  onClick: () => void
}

export default function FloatingBoard({ photo, caption, onClick }: FloatingBoardProps) {
  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.board}>
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
