import { useState } from 'react'
import { useRouter } from 'next/router'
import MobileWrapper from '@/components/MobileWrapper'
import styles from '@/styles/Home.module.css'

export default function Home() {
  const router = useRouter()
  const showFrame = router.query.frame !== 'false'
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const imageFiles = files.filter(f => f.type.startsWith('image/'))
    if (imageFiles.length !== files.length) {
      alert('Please select only image files')
      return
    }

    setSelectedFiles(imageFiles)
  }

  const handleGenerate = async () => {
    if (selectedFiles.length === 0) return

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2500))
    router.push('/tour')
  }

  const content = (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Relive your memories
            <br />
            in 3D space
          </h1>

          <p className={styles.subtitle}>
            Turn a single photo into an immersive experience.
            <br />
            Walk through the moments that matter.
          </p>

          <div className={styles.uploadSection}>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className={styles.fileInput}
            />

            <label htmlFor="file-input" className={styles.fileLabel}>
              {selectedFiles.length > 0 ? (
                <span className={styles.fileName}>
                  {selectedFiles.length} photo{selectedFiles.length > 1 ? 's' : ''} selected
                </span>
              ) : (
                'Select photos'
              )}
            </label>

            {selectedFiles.length > 0 && !loading && (
              <button onClick={handleGenerate} className={styles.button}>
                Relive this memory
              </button>
            )}

            {loading && (
              <div className={styles.loadingState}>
                <div className={styles.spinner} />
                <p className={styles.loadingText}>Reconstructing your memory</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )

  return <MobileWrapper showFrame={showFrame}>{content}</MobileWrapper>
}
