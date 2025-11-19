import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/Tour.module.css'
import type { PannellumConfig, PannellumViewer } from '@/types/pannellum'
import MemoryBoard from '@/components/MemoryBoard'
import FloatingBoard from '@/components/FloatingBoard'

interface Scene {
  id: string
  name: string
  imageUrl: string
  pitch: number
  yaw: number
  hfov?: number
  hotspots: Hotspot[]
}

interface Hotspot {
  pitch: number
  yaw: number
  type: string
  text: string
  sceneId?: string
  photo?: string
  caption?: string
  audioUrl?: string
  floating?: boolean
}

interface TourData {
  title: string
  scenes: Scene[]
  default: string
}

export default function TourPage() {
  const router = useRouter()
  const viewerRef = useRef<HTMLDivElement>(null)
  const [tourData, setTourData] = useState<TourData | null>(null)
  const [currentScene, setCurrentScene] = useState<string>('')
  const [viewer, setViewer] = useState<PannellumViewer | null>(null)
  const [loading, setLoading] = useState(true)
  const [transitioning, setTransitioning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [memoryBoard, setMemoryBoard] = useState<{photo: string, caption: string, audioUrl: string} | null>(null)
  const retryCountRef = useRef(0)

  useEffect(() => {
    const loadTourData = async () => {
      try {
        const response = await fetch('/tour/data.json')
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`)
        }
        const data: TourData = await response.json()
        setTourData(data)
        setCurrentScene(data.default)
      } catch (error) {
        console.error('Failed to load tour data:', error)
        setError('Failed to load tour data')
        setLoading(false)
      }
    }

    loadTourData()
  }, [])

  useEffect(() => {
    if (!tourData || !viewerRef.current || !currentScene) return

    if (typeof window === 'undefined') return

    if (!window.pannellum) {
      if (retryCountRef.current < 50) {
        retryCountRef.current++
        const timer = setTimeout(() => {
          setLoading(prev => prev)
        }, 100)
        return () => clearTimeout(timer)
      } else {
        setError('Failed to load 360° viewer')
        setLoading(false)
        return
      }
    }

    retryCountRef.current = 0

    const scene = tourData.scenes.find(s => s.id === currentScene)
    if (!scene) {
      setError('Scene not found')
      setLoading(false)
      return
    }

    if (viewer) {
      viewer.destroy()
    }

    try {
      const config: PannellumConfig = {
        type: 'equirectangular',
        panorama: scene.imageUrl,
        pitch: scene.pitch,
        yaw: scene.yaw,
        hfov: scene.hfov || 110,
        autoLoad: true,
        showControls: false,
        mouseZoom: false,
      }

      const viewerInstance = window.pannellum.viewer(viewerRef.current, config)

      viewerInstance.on('load', () => {
        setLoading(false)
        setTransitioning(false)
        setError(null)

        scene.hotspots.forEach((hotspot, index) => {
          const isMemoryBoard = hotspot.type === 'info'

          if (hotspot.floating) {
            return
          }

          viewerInstance.addHotSpot({
            id: `hotspot-${index}`,
            pitch: hotspot.pitch,
            yaw: hotspot.yaw,
            type: 'custom',
            cssClass: isMemoryBoard ? 'memory-hotspot' : 'custom-hotspot',
            createTooltipFunc: (hotSpotDiv: HTMLElement) => {
              hotSpotDiv.innerHTML = `
                <div class="hotspot-content">
                  <div class="hotspot-icon">${isMemoryBoard ? '📋' : '→'}</div>
                  <div class="hotspot-label">${hotspot.text}</div>
                </div>
              `
            },
            clickHandlerFunc: () => {
              if (isMemoryBoard && hotspot.photo && hotspot.caption && hotspot.audioUrl) {
                setMemoryBoard({
                  photo: hotspot.photo,
                  caption: hotspot.caption,
                  audioUrl: hotspot.audioUrl
                })
              } else if (hotspot.sceneId) {
                navigateToScene(hotspot.sceneId)
              }
            }
          })
        })
      })

      viewerInstance.on('error', (err: any) => {
        console.error('Pannellum error:', err)
        setError('Failed to load 360° image')
        setLoading(false)
      })

      setViewer(viewerInstance)

      return () => {
        if (viewerInstance) {
          try {
            viewerInstance.destroy()
          } catch (e) {
            console.error('Error destroying viewer:', e)
          }
        }
      }
    } catch (err) {
      console.error('Error creating viewer:', err)
      setError('Failed to initialize viewer')
      setLoading(false)
    }
  }, [tourData, currentScene])

  const navigateToScene = (sceneId: string) => {
    if (!tourData || transitioning) return

    setTransitioning(true)
    setTimeout(() => {
      setCurrentScene(sceneId)
    }, 300)
  }

  const getCurrentSceneName = () => {
    if (!tourData || !currentScene) return ''
    const scene = tourData.scenes.find(s => s.id === currentScene)
    return scene?.name || ''
  }

  const getFloatingHotspot = () => {
    if (!tourData || !currentScene) return null
    const scene = tourData.scenes.find(s => s.id === currentScene)
    return scene?.hotspots.find(h => h.floating && h.photo && h.caption && h.audioUrl)
  }

  return (
    <div className={styles.container}>
      {(loading || transitioning) && !error && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>
            {loading ? 'Loading memory space...' : 'Transitioning...'}
          </p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <p className={styles.errorText}>{error}</p>
          <button
            className={styles.errorButton}
            onClick={() => router.push('/')}
          >
            ← Back to home
          </button>
        </div>
      )}

      <div
        ref={viewerRef}
        className={styles.viewer}
        style={{
          opacity: loading || transitioning || error ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
      />

      {!error && (
        <>
          <div className={styles.topBar}>
            <button
              className={styles.backButton}
              onClick={() => router.push('/')}
            >
              ← Back
            </button>

            <h2 className={styles.sceneTitle}>{getCurrentSceneName()}</h2>

            <div className={styles.spacer} />
          </div>

          {tourData && (
            <div className={styles.bottomNav}>
              {tourData.scenes.map(scene => (
                <button
                  key={scene.id}
                  className={`${styles.sceneButton} ${
                    scene.id === currentScene ? styles.active : ''
                  }`}
                  onClick={() => navigateToScene(scene.id)}
                  disabled={transitioning}
                >
                  {scene.name}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !transitioning && !error && (() => {
        const floatingHotspot = getFloatingHotspot()
        return floatingHotspot ? (
          <FloatingBoard
            photo={floatingHotspot.photo!}
            caption={floatingHotspot.caption!}
            onClick={() => setMemoryBoard({
              photo: floatingHotspot.photo!,
              caption: floatingHotspot.caption!,
              audioUrl: floatingHotspot.audioUrl!
            })}
          />
        ) : null
      })()}

      {memoryBoard && (
        <MemoryBoard
          photo={memoryBoard.photo}
          caption={memoryBoard.caption}
          audioUrl={memoryBoard.audioUrl}
          onClose={() => setMemoryBoard(null)}
        />
      )}
    </div>
  )
}
