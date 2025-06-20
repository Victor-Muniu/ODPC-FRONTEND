import { useRef, useEffect, useState } from "react"
import { Trash2, Save } from "lucide-react"

const SignatureField = ({ label, value, onChange, required = false }) => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.lineCap = "round"

    canvas.width = 400
    canvas.height = 150

    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (value) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        setHasSignature(true)
      }
      img.src = value
    }
  }, [value])

  const startDrawing = (e) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
    setHasSignature(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
    onChange("")
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    const dataURL = canvas.toDataURL()
    onChange(dataURL)
  }

  return (
    <div className="signature-field">
      <label>
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      <div className="signature-container">
        <canvas
          ref={canvasRef}
          className="signature-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <div className="signature-controls">
          <button type="button" className="btn-secondary" onClick={clearSignature}>
            <Trash2 size={16} />
            Clear
          </button>
          <button type="button" className="btn-primary" onClick={saveSignature} disabled={!hasSignature}>
            <Save size={16} />
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignatureField
