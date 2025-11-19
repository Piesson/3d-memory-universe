import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/Home.module.css'

export default function Home() {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setSelectedFile(file)
  }

  const handleGenerate = async () => {
    if (!selectedFile) return

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2500))
    router.push('/tour')
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Transform your space
            <br />
            into an immersive
            <br />
            3D experience
          </h1>

          <p className={styles.subtitle}>
            Upload a single photo and explore your space in 360°
          </p>

          <div className={styles.uploadSection}>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              onChange={handleFileSelect}
              className={styles.fileInput}
            />

            <label htmlFor="file-input" className={styles.fileLabel}>
              {selectedFile ? (
                <span className={styles.fileName}>
                  {selectedFile.name}
                  <span className={styles.fileSize}>
                    {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </span>
              ) : (
                'Select photo'
              )}
            </label>

            {selectedFile && !loading && (
              <button onClick={handleGenerate} className={styles.button}>
                Generate 3D tour
              </button>
            )}

            {loading && (
              <div className={styles.loadingState}>
                <div className={styles.spinner} />
                <p className={styles.loadingText}>Analyzing your space</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
