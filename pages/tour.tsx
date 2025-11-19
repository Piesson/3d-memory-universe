import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/Tour.module.css'
import type { PannellumConfig, PannellumViewer } from '@/types/pannellum'

interface Scene {
  id: string
  name: string
  imageUrl: string
  pitch: number
  yaw: number
  hotspots: Hotspot[]
}

interface Hotspot {
  pitch: number
  yaw: number
  type: string
  text: string
  sceneId: string
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

  useEffect(() => {
    const loadTourData = async () => {
      try {
        const response = await fetch('/tour/data.json')
        const data: TourData = await response.json()
        setTourData(data)
        setCurrentScene(data.default)
      } catch (error) {
        console.error('Failed to load tour data:', error)
      }
    }

    loadTourData()
  }, [])

  useEffect(() => {
    if (!tourData || !viewerRef.current || !currentScene || typeof window === 'undefined') return
    if (!window.pannellum) {
      setTimeout(() => setLoading(loading), 100)
      return
    }

    const scene = tourData.scenes.find(s => s.id === currentScene)
    if (!scene) return

    if (viewer) {
      viewer.destroy()
    }

    const config: PannellumConfig = {
      type: 'equirectangular',
      panorama: scene.imageUrl,
      pitch: scene.pitch,
      yaw: scene.yaw,
      hfov: 110,
      autoLoad: true,
      showControls: false,
      mouseZoom: false,
    }

    const viewerInstance = window.pannellum.viewer(viewerRef.current, config)

    viewerInstance.on('load', () => {
      setLoading(false)
      setTransitioning(false)

      scene.hotspots.forEach((hotspot, index) => {
        viewerInstance.addHotSpot({
          id: `hotspot-${index}`,
          pitch: hotspot.pitch,
          yaw: hotspot.yaw,
          type: 'custom',
          cssClass: 'custom-hotspot',
          createTooltipFunc: (hotSpotDiv: HTMLElement) => {
            hotSpotDiv.innerHTML = `
              <div class="hotspot-content">
                <div class="hotspot-icon">→</div>
                <div class="hotspot-label">${hotspot.text}</div>
              </div>
            `
          },
          clickHandlerFunc: () => {
            navigateToScene(hotspot.sceneId)
          }
        })
      })
    })

    setViewer(viewerInstance)

    return () => {
      if (viewerInstance) {
        viewerInstance.destroy()
      }
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

  return (
    <div className={styles.container}>
      {(loading || transitioning) && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      )}

      <div
        ref={viewerRef}
        className={styles.viewer}
        style={{
          opacity: loading || transitioning ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
      />

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
    </div>
  )
}
