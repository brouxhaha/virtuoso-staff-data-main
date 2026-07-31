import { ReactNode, useEffect, useState } from 'react'

interface DevFrameProps {
  children: ReactNode
}

export function DevFrame({ children }: DevFrameProps) {
  const [scale, setScale] = useState(1)
  
  const DISPLAY_WIDTH = 2160
  const DISPLAY_HEIGHT = 3840
  const ASPECT_RATIO = DISPLAY_WIDTH / DISPLAY_HEIGHT

  useEffect(() => {
    const calculateScale = () => {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      
      const scaleX = (windowWidth * 0.9) / DISPLAY_WIDTH
      const scaleY = (windowHeight * 0.9) / DISPLAY_HEIGHT
      
      setScale(Math.min(scaleX, scaleY))
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  const frameWidth = DISPLAY_WIDTH * scale
  const frameHeight = DISPLAY_HEIGHT * scale

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}
    >
      <div 
        className="relative bg-gray-900 rounded-lg shadow-2xl"
        style={{
          width: `${frameWidth + 40}px`,
          height: `${frameHeight + 40}px`,
          padding: '20px',
        }}
      >
        <div 
          className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800 rounded-full text-xs font-mono text-gray-300 z-50"
        >
          2160×3840 (9:16) • Scale: {Math.round(scale * 100)}%
        </div>
        
        <div 
          className="w-full h-full bg-white rounded overflow-hidden relative"
          style={{
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
          }}
        >
          <div 
            className="origin-top-left"
            style={{
              width: `${DISPLAY_WIDTH}px`,
              height: `${DISPLAY_HEIGHT}px`,
              transform: `scale(${scale})`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
