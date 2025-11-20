import { useState, useRef, useEffect } from 'react'
import styles from '@/styles/MemoryBoard.module.css'

interface MemoryBoardProps {
  photo: string
  caption: string
  audioUrl: string
  onClose: () => void
  imagePosition?: string
}

export default function MemoryBoard({ photo, caption, audioUrl, onClose, imagePosition = 'center top' }: MemoryBoardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => setIsPlaying(false)
    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [])

  const toggleAudio = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.board} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <div className={styles.photoFrame}>
          <img src={photo} alt={caption} style={{ objectPosition: imagePosition }} />
        </div>

        <p className={styles.caption}>{caption}</p>

        <div className={styles.audioSection}>
          <button
            className={`${styles.audioButton} ${isPlaying ? styles.playing : ''}`}
            onClick={toggleAudio}
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isPlaying ? '⏸' : '🎤'}
          </button>
          <audio ref={audioRef} src={audioUrl} />
        </div>
      </div>
    </div>
  )
}
