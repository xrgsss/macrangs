import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Camera,
  CameraOff,
  Circle,
  Download,
  FlipHorizontal2,
  Image as ImageIcon,
  Loader2,
  Play,
  RefreshCw,
  ShieldAlert,
  Square,
  Trash2,
  Video,
  X,
} from 'lucide-react'

type CameraStatus = 'idle' | 'starting' | 'live' | 'error' | 'unsupported'
type ShotKind = 'photo' | 'video'

interface Shot {
  id: string
  kind: ShotKind
  url: string
  createdAt: number
}

function describeCameraError(error: unknown) {
  const name = error instanceof DOMException ? error.name : ''
  switch (name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'Camera access was blocked. Allow camera access for this site in your browser settings, then try again.'
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return 'No camera was found. Connect a webcam or check that it is enabled, then try again.'
    case 'NotReadableError':
    case 'TrackStartError':
      return 'The camera is already in use by another application. Close it there and try again.'
    case 'OverconstrainedError':
    case 'ConstraintNotSatisfiedError':
      return 'That camera is not available right now. Choose a different camera and try again.'
    default:
      return error instanceof Error && error.message
        ? error.message
        : 'The camera could not be started. Please try again.'
  }
}

function formatElapsed(ms: number) {
  const total = Math.floor(ms / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const RECORDING_SUPPORTED = typeof window !== 'undefined' && typeof window.MediaRecorder !== 'undefined'

export function CameraApp() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const requestRef = useRef(0)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const flashTimer = useRef<number | null>(null)

  const [status, setStatus] = useState<CameraStatus>('idle')
  const [error, setError] = useState('')
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [deviceId, setDeviceId] = useState('')
  const [mirror, setMirror] = useState(true)
  const [flash, setFlash] = useState(false)
  const [shots, setShots] = useState<Shot[]>([])
  const [preview, setPreview] = useState<Shot | null>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [mode, setMode] = useState<'photo' | 'video'>('photo')
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [resolution, setResolution] = useState('')

  const addShot = useCallback((kind: ShotKind, url: string) => {
    setShots((prev) => {
      const shot: Shot = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        kind,
        url,
        createdAt: Date.now(),
      }
      const next = [shot, ...prev]
      next.slice(24).forEach((old) => {
        if (old.kind === 'video') URL.revokeObjectURL(old.url)
      })
      return next.slice(0, 24)
    })
  }, [])

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }, [])

  const startCamera = useCallback(async (id?: string) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported')
      return
    }
    const request = ++requestRef.current
    setStatus('starting')
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: id ? { deviceId: { exact: id } } : { facingMode: 'user' },
        audio: false,
      })
      if (request !== requestRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = stream
      const video = videoRef.current
      if (video) {
        video.srcObject = stream
        try {
          await video.play()
        } catch {
          /* autoplay can be blocked until the element is visible */
        }
      }
      const track = stream.getVideoTracks()[0]
      const settings = track?.getSettings()
      setResolution(
        settings?.width && settings?.height ? `${settings.width} × ${settings.height}` : '',
      )
      const list = (await navigator.mediaDevices.enumerateDevices()).filter(
        (item) => item.kind === 'videoinput',
      )
      setDevices(list)
      setDeviceId(settings?.deviceId ?? id ?? list[0]?.deviceId ?? '')
      setStatus('live')
    } catch (err) {
      if (request !== requestRef.current) return
      stopTracks()
      setStatus('error')
      setError(describeCameraError(err))
      setDeviceId('')
    }
  }, [stopTracks])

  const stopCamera = useCallback(() => {
    requestRef.current += 1
    const recorder = recorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.stop()
      } catch {
        /* already stopping */
      }
    }
    stopTracks()
    setStatus('idle')
    setDeviceId('')
    setDevices([])
    setResolution('')
    setRecording(false)
    setElapsed(0)
  }, [stopTracks])

  useEffect(() => {
    const media = navigator.mediaDevices
    if (!media?.addEventListener) return
    const refresh = async () => {
      const list = (await media.enumerateDevices()).filter((item) => item.kind === 'videoinput')
      setDevices(list)
    }
    media.addEventListener('devicechange', refresh)
    return () => media.removeEventListener('devicechange', refresh)
  }, [])

  useEffect(() => {
    return () => {
      requestRef.current += 1
      const recorder = recorderRef.current
      if (recorder && recorder.state !== 'inactive') {
        try {
          recorder.stop()
        } catch {
          /* already stopping */
        }
      }
      streamRef.current?.getTracks().forEach((track) => track.stop())
      if (flashTimer.current) window.clearTimeout(flashTimer.current)
    }
  }, [])

  useEffect(() => {
    if (!recording) return
    const started = Date.now()
    setElapsed(0)
    const timer = window.setInterval(() => setElapsed(Date.now() - started), 250)
    return () => window.clearInterval(timer)
  }, [recording])

  useEffect(() => {
    if (!preview && !galleryOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      if (preview) setPreview(null)
      else setGalleryOpen(false)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [preview, galleryOpen])

  const capturePhoto = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    if (!context) return
    if (mirror) {
      context.translate(canvas.width, 0)
      context.scale(-1, 1)
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    addShot('photo', canvas.toDataURL('image/jpeg', 0.92))
    setFlash(true)
    if (flashTimer.current) window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setFlash(false), 240)
  }

  const startRecording = () => {
    const stream = streamRef.current
    if (!stream) return
    if (typeof MediaRecorder === 'undefined') {
      setError('Video recording is not supported in this browser.')
      return
    }
    try {
      const mimeType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(
        (type) => !MediaRecorder.isTypeSupported || MediaRecorder.isTypeSupported(type),
      )
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      chunksRef.current = []
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' })
        chunksRef.current = []
        recorderRef.current = null
        setRecording(false)
        setElapsed(0)
        if (blob.size > 0) addShot('video', URL.createObjectURL(blob))
      }
      recorder.onerror = () => {
        setError('Recording stopped unexpectedly. Please try again.')
        setRecording(false)
      }
      recorder.start(250)
      recorderRef.current = recorder
      setRecording(true)
      setError('')
    } catch {
      setError('Video recording could not start on this camera.')
    }
  }

  const stopRecording = () => {
    const recorder = recorderRef.current
    if (!recorder || recorder.state === 'inactive') return
    recorder.stop()
  }

  const handleShutter = () => {
    if (status !== 'live') return
    if (mode === 'photo') capturePhoto()
    else if (recording) stopRecording()
    else startRecording()
  }

  const deleteShot = (shot: Shot) => {
    setShots((prev) => prev.filter((item) => item.id !== shot.id))
    if (shot.kind === 'video') URL.revokeObjectURL(shot.url)
    setPreview(null)
  }

  const statusLabel =
    status === 'live'
      ? recording
        ? 'Recording'
        : 'Live'
      : status === 'starting'
        ? 'Connecting'
        : status === 'error'
          ? 'Unavailable'
          : status === 'unsupported'
            ? 'Unsupported'
            : 'Camera off'

  const activeDevice = devices.find((item) => item.deviceId === deviceId)

  return (
    <div data-camera className="flex h-full min-h-0 flex-col bg-[#0b0c10] text-white">
      <div className="flex h-[42px] shrink-0 items-center gap-[8px] border-b border-white/[0.08] bg-[#111217] px-[12px]">
        <span
          className={`h-[6px] w-[6px] shrink-0 rounded-full ${
            status === 'live'
              ? recording
                ? 'animate-pulse bg-[#ff453a] shadow-[0_0_8px_rgba(255,69,58,0.8)]'
                : 'bg-[#30d158] shadow-[0_0_8px_rgba(48,209,88,0.6)]'
              : status === 'starting'
                ? 'animate-pulse bg-[#ffd60a]'
                : 'bg-white/25'
          }`}
        />
        <span className="text-[11px] font-medium tracking-[-0.05px] text-white/75">{statusLabel}</span>
        {status === 'live' && resolution && (
          <span className="hidden text-[10px] tabular text-white/30 sm:inline">{resolution}</span>
        )}
        {status === 'live' && activeDevice?.label && (
          <span className="hidden max-w-[200px] truncate text-[10px] text-white/30 sm:inline">
            · {activeDevice.label}
          </span>
        )}

        <div className="ml-auto flex items-center gap-[5px]">
          <button
            onClick={() => setMirror((value) => !value)}
            aria-label="Mirror preview"
            aria-pressed={mirror}
            className={`grid h-[25px] w-[25px] place-items-center rounded-[6px] transition-colors ${
              mirror ? 'bg-white/15 text-white' : 'text-white/45 hover:bg-white/10 hover:text-white/70'
            }`}
          >
            <FlipHorizontal2 className="h-[13px] w-[13px]" strokeWidth={2} />
          </button>
          {status === 'live' && (
            <button
              onClick={stopCamera}
              aria-label="Turn off camera"
              className="grid h-[25px] w-[25px] place-items-center rounded-[6px] text-white/45 transition-colors hover:bg-white/10 hover:text-white/70"
            >
              <CameraOff className="h-[13px] w-[13px]" strokeWidth={2} />
            </button>
          )}
          <select
            aria-label="Camera device"
            value={deviceId}
            onChange={(event) => {
              setDeviceId(event.target.value)
              void startCamera(event.target.value)
            }}
            disabled={status !== 'live' || devices.length === 0 || recording}
            style={{ colorScheme: 'dark' }}
            className="max-w-[168px] rounded-[6px] border border-white/10 bg-white/[0.08] px-[7px] py-[3px] text-[10.5px] text-white/70 outline-none disabled:opacity-40"
          >
            {devices.length === 0 ? (
              <option value="">Default camera</option>
            ) : (
              devices.map((device, index) => (
                <option key={device.deviceId || index} value={device.deviceId}>
                  {device.label || `Camera ${index + 1}`}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            status === 'live' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transform: mirror ? 'scaleX(-1)' : 'none' }}
        />

        {status === 'live' && (
          <>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(0,0,0,0.34)_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[72px] bg-gradient-to-b from-black/45 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[86px] bg-gradient-to-t from-black/55 to-transparent" />
            <span className="pointer-events-none absolute left-[14px] top-[12px] flex items-center gap-[6px] rounded-full border border-white/10 bg-black/35 px-[8px] py-[3px] text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/80 backdrop-blur-md">
              <span className={`h-[5px] w-[5px] rounded-full ${recording ? 'bg-[#ff453a]' : 'bg-[#30d158]'}`} />
              {recording ? `Rec ${formatElapsed(elapsed)}` : 'Live'}
            </span>
            <div className="pointer-events-none absolute inset-[14px] rounded-[10px]">
              <span className="absolute left-0 top-0 h-[14px] w-[14px] rounded-tl-[5px] border-l border-t border-white/30" />
              <span className="absolute right-0 top-0 h-[14px] w-[14px] rounded-tr-[5px] border-r border-t border-white/30" />
              <span className="absolute bottom-0 left-0 h-[14px] w-[14px] rounded-bl-[5px] border-b border-l border-white/30" />
              <span className="absolute bottom-0 right-0 h-[14px] w-[14px] rounded-br-[5px] border-b border-r border-white/30" />
            </div>

            {shots.length > 0 && (
              <div className="absolute inset-x-[14px] bottom-[12px] flex items-center gap-[6px]">
                {shots.slice(0, 6).map((shot) => (
                  <button
                    key={shot.id}
                    onClick={() => setPreview(shot)}
                    aria-label={`Open ${shot.kind}`}
                    className="group relative h-[34px] w-[46px] shrink-0 overflow-hidden rounded-[5px] border border-white/25 bg-black/50 shadow-[0_2px_8px_rgba(0,0,0,0.45)] transition-transform hover:scale-[1.06]"
                  >
                    <ShotThumb shot={shot} />
                  </button>
                ))}
                <span className="ml-auto rounded-full bg-black/40 px-[8px] py-[3px] text-[9.5px] text-white/60 backdrop-blur-md">
                  {shots.length} {shots.length === 1 ? 'capture' : 'captures'}
                </span>
              </div>
            )}
          </>
        )}

        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 0.92 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="pointer-events-none absolute inset-0 z-20 bg-white"
            />
          )}
        </AnimatePresence>

        {status !== 'live' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-[28px] text-center">
            {status === 'starting' ? (
              <div className="flex flex-col items-center gap-[12px]">
                <Loader2 className="h-[28px] w-[28px] animate-spin text-white/65" strokeWidth={1.6} />
                <p className="text-[13px] font-medium text-white/80">Connecting to camera…</p>
                <p className="text-[10.5px] text-white/35">Approve the browser permission request if prompted.</p>
              </div>
            ) : status === 'error' ? (
              <div className="flex w-full max-w-[400px] flex-col items-center gap-[10px] rounded-[16px] border border-white/10 bg-white/[0.04] px-[24px] py-[22px]">
                <span className="grid h-[46px] w-[46px] place-items-center rounded-full bg-[#ff453a]/[0.12] text-[#ff6961]">
                  <ShieldAlert className="h-[22px] w-[22px]" strokeWidth={1.7} />
                </span>
                <p className="text-[14px] font-semibold">Camera unavailable</p>
                <p className="text-[11px] leading-[17px] text-white/45">{error}</p>
                <button
                  onClick={() => void startCamera(deviceId || undefined)}
                  className="mt-[2px] flex items-center gap-[6px] rounded-[7px] bg-white px-[13px] py-[6px] text-[11.5px] font-semibold text-black transition hover:bg-white/90 active:scale-[0.98]"
                >
                  <RefreshCw className="h-[12px] w-[12px]" strokeWidth={2.3} />
                  Try Again
                </button>
              </div>
            ) : status === 'unsupported' ? (
              <div className="flex w-full max-w-[400px] flex-col items-center gap-[10px] rounded-[16px] border border-white/10 bg-white/[0.04] px-[24px] py-[22px]">
                <span className="grid h-[46px] w-[46px] place-items-center rounded-full bg-white/[0.07] text-white/50">
                  <CameraOff className="h-[22px] w-[22px]" strokeWidth={1.7} />
                </span>
                <p className="text-[14px] font-semibold">Camera not available</p>
                <p className="text-[11px] leading-[17px] text-white/45">
                  This browser can’t access a camera. Open the desktop over localhost or HTTPS in a modern
                  browser to connect a device camera.
                </p>
              </div>
            ) : (
              <>
                <span className="grid h-[76px] w-[76px] place-items-center rounded-[22px] border border-white/10 bg-white/[0.05] text-white/65 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
                  <Camera className="h-[34px] w-[34px]" strokeWidth={1.5} />
                </span>
                <p className="mt-[17px] text-[16px] font-semibold tracking-[-0.2px]">Camera is off</p>
                <p className="mt-[6px] max-w-[330px] text-[11px] leading-[17px] text-white/40">
                  Turn on the camera to see a live preview of your device. Your browser will ask for
                  permission the first time.
                </p>
                <button
                  onClick={() => void startCamera()}
                  className="mt-[16px] flex items-center gap-[7px] rounded-[8px] bg-white px-[16px] py-[7px] text-[12px] font-semibold text-black shadow-lg transition hover:bg-white/90 active:scale-[0.98]"
                >
                  <Video className="h-[13px] w-[13px]" strokeWidth={2.2} />
                  Turn On Camera
                </button>
                <p className="mt-[12px] text-[9.5px] text-white/25">
                  The feed is processed on this device and never uploaded.
                </p>
              </>
            )}
          </div>
        )}

        <AnimatePresence>
          {galleryOpen && (
            <motion.div
              data-camera-gallery
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0 z-30 flex flex-col bg-[#0b0c10]/[0.96] backdrop-blur-xl"
            >
              <div className="flex h-[46px] shrink-0 items-center justify-between border-b border-white/[0.08] px-[14px]">
                <div className="flex items-baseline gap-[7px]">
                  <span className="text-[13px] font-semibold">Gallery</span>
                  <span className="text-[10px] text-white/35">
                    {shots.length} {shots.length === 1 ? 'capture' : 'captures'}
                  </span>
                </div>
                <button
                  onClick={() => setGalleryOpen(false)}
                  aria-label="Close gallery"
                  className="grid h-[24px] w-[24px] place-items-center rounded-full bg-white/[0.08] text-white/60 hover:bg-white/15 hover:text-white"
                >
                  <X className="h-[13px] w-[13px]" strokeWidth={2.2} />
                </button>
              </div>
              {shots.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-[10px] text-white/35">
                  <ImageIcon className="h-[30px] w-[30px]" strokeWidth={1.3} />
                  <p className="text-[12px]">No captures yet</p>
                  <p className="text-[10px] text-white/20">Photos and videos you capture appear here.</p>
                </div>
              ) : (
                <div className="grid min-h-0 flex-1 auto-rows-min grid-cols-3 gap-[10px] overflow-y-auto p-[14px] sm:grid-cols-4">
                  {shots.map((shot) => (
                    <button
                      key={shot.id}
                      onClick={() => {
                        setGalleryOpen(false)
                        setPreview(shot)
                      }}
                      className="group overflow-hidden rounded-[7px] border border-white/10 bg-black/40 text-left transition-transform hover:scale-[1.02]"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <ShotThumb shot={shot} fill />
                      </div>
                      <div className="flex items-center justify-between px-[7px] py-[5px]">
                        <span className="text-[9.5px] text-white/50">{formatTime(shot.createdAt)}</span>
                        <span className="text-[9px] uppercase tracking-[0.08em] text-white/30">
                          {shot.kind}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {preview && (
            <motion.div
              data-camera-preview
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setPreview(null)}
              className="absolute inset-0 z-40 flex flex-col bg-black/[0.92] backdrop-blur-md"
            >
              <div className="flex h-[44px] shrink-0 items-center justify-between px-[14px]">
                <div className="flex items-center gap-[7px] text-[11px] text-white/55">
                  {preview.kind === 'photo' ? (
                    <ImageIcon className="h-[13px] w-[13px]" strokeWidth={2} />
                  ) : (
                    <Video className="h-[13px] w-[13px]" strokeWidth={2} />
                  )}
                  <span className="capitalize">{preview.kind}</span>
                  <span className="text-white/25">·</span>
                  <span>{formatTime(preview.createdAt)}</span>
                </div>
                <div className="flex items-center gap-[5px]">
                  <a
                    href={preview.url}
                    download={`Camera-${preview.id}.${preview.kind === 'photo' ? 'jpg' : 'webm'}`}
                    onClick={(event) => event.stopPropagation()}
                    aria-label="Download capture"
                    className="grid h-[26px] w-[26px] place-items-center rounded-[6px] text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <Download className="h-[13px] w-[13px]" strokeWidth={2} />
                  </a>
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      deleteShot(preview)
                    }}
                    aria-label="Delete capture"
                    className="grid h-[26px] w-[26px] place-items-center rounded-[6px] text-white/60 hover:bg-white/10 hover:text-[#ff6961]"
                  >
                    <Trash2 className="h-[13px] w-[13px]" strokeWidth={2} />
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      setPreview(null)
                    }}
                    aria-label="Close capture"
                    className="grid h-[26px] w-[26px] place-items-center rounded-[6px] text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-[14px] w-[14px]" strokeWidth={2.2} />
                  </button>
                </div>
              </div>
              <div className="flex min-h-0 flex-1 items-center justify-center p-[18px]">
                {preview.kind === 'photo' ? (
                  <motion.img
                    key={preview.id}
                    src={preview.url}
                    alt="Camera capture"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={(event) => event.stopPropagation()}
                    className="max-h-full max-w-full rounded-[8px] object-contain shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                  />
                ) : (
                  <video
                    key={preview.id}
                    src={preview.url}
                    controls
                    autoPlay
                    onClick={(event) => event.stopPropagation()}
                    className="max-h-full max-w-full rounded-[8px] object-contain shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex h-[92px] shrink-0 items-center border-t border-white/[0.08] bg-[#0e0f13] px-[16px]">
        <div className="flex flex-1 items-center">
          <div className="flex rounded-[7px] bg-white/[0.07] p-[2px] text-[10.5px]">
            <button
              onClick={() => {
                if (recording) stopRecording()
                setMode('photo')
              }}
              className={`flex items-center gap-[5px] rounded-[5px] px-[9px] py-[4px] font-medium transition-colors ${
                mode === 'photo' ? 'bg-white/15 text-white' : 'text-white/45 hover:text-white/75'
              }`}
            >
              <Circle className="h-[9px] w-[9px]" strokeWidth={2.4} />
              Photo
            </button>
            {RECORDING_SUPPORTED && (
              <button
                onClick={() => setMode('video')}
                className={`flex items-center gap-[5px] rounded-[5px] px-[9px] py-[4px] font-medium transition-colors ${
                  mode === 'video' ? 'bg-white/15 text-white' : 'text-white/45 hover:text-white/75'
                }`}
              >
                <Video className="h-[11px] w-[11px]" strokeWidth={2.2} />
                Video
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-1 justify-center">
          <button
            onClick={handleShutter}
            disabled={status !== 'live'}
            aria-label={
              mode === 'photo'
                ? 'Capture photo'
                : recording
                  ? 'Stop recording'
                  : 'Start recording'
            }
            className="group grid h-[58px] w-[58px] place-items-center rounded-full border-[3px] border-white/85 bg-white/[0.04] transition-all hover:border-white active:scale-[0.96] disabled:cursor-default disabled:border-white/25 disabled:opacity-50"
          >
            {mode === 'photo' ? (
              <span className="h-[44px] w-[44px] rounded-full bg-white transition-transform duration-100 group-active:scale-90" />
            ) : recording ? (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="grid h-[44px] w-[44px] place-items-center rounded-full"
              >
                <Square className="h-[19px] w-[19px] fill-[#ff453a] text-[#ff453a]" />
              </motion.span>
            ) : (
              <span className="h-[44px] w-[44px] rounded-full bg-[#ff453a] transition-transform duration-100 group-active:scale-90" />
            )}
          </button>
        </div>

        <div className="flex flex-1 items-center justify-end gap-[8px]">
          <button
            onClick={() => setGalleryOpen(true)}
            aria-label="Open gallery"
            className="flex items-center gap-[6px] rounded-[7px] bg-white/[0.07] px-[9px] py-[5px] text-[10.5px] font-medium text-white/65 transition-colors hover:bg-white/[0.12] hover:text-white"
          >
            <ImageIcon className="h-[13px] w-[13px]" strokeWidth={2} />
            <span className="tabular">{shots.length}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function ShotThumb({ shot, fill }: { shot: Shot; fill?: boolean }) {
  if (shot.kind === 'video') {
    return (
      <div className={`relative ${fill ? 'h-full w-full' : 'h-full w-full'} bg-[#16181e]`}>
        <video
          src={shot.url}
          muted
          preload="metadata"
          className="h-full w-full object-cover opacity-80"
        />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-[16px] w-[16px] place-items-center rounded-full bg-black/55">
            <Play className="ml-[1px] h-[7px] w-[7px] fill-white text-white" />
          </span>
        </span>
      </div>
    )
  }
  return <img src={shot.url} alt="" className="h-full w-full object-cover" />
}
