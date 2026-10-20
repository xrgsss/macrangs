import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Camera,
  CameraOff,
  Check,
  Download,
  Image as ImageIcon,
  LayoutGrid,
  Loader2,
  Play,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Square,
  Trash2,
  Video,
  X,
} from 'lucide-react'

type BoothStatus = 'idle' | 'starting' | 'live' | 'error' | 'unsupported'
type BoothMode = 'library' | 'camera' | 'video'
type ShotKind = 'photo' | 'video'

interface Shot {
  id: string
  kind: ShotKind
  url: string
  createdAt: number
  duration?: number
}

interface BoothEffect {
  id: string
  name: string
  filter: string
  from: string
  to: string
}

const EFFECTS: BoothEffect[] = [
  { id: 'normal', name: 'Normal', filter: 'none', from: '#5ac8fa', to: '#0a84ff' },
  { id: 'mono', name: 'Mono', filter: 'grayscale(1) contrast(1.08)', from: '#a1a1a6', to: '#3a3a3c' },
  { id: 'noir', name: 'Noir', filter: 'grayscale(1) contrast(1.35) brightness(0.92)', from: '#6c6c70', to: '#0c0c0d' },
  { id: 'sepia', name: 'Sepia', filter: 'sepia(0.78) contrast(1.02)', from: '#dfb57a', to: '#8b5a2b' },
  { id: 'warm', name: 'Warm', filter: 'saturate(1.18) sepia(0.2) brightness(1.03)', from: '#ffc078', to: '#ff5f57' },
  { id: 'cool', name: 'Cool', filter: 'saturate(1.12) hue-rotate(12deg) brightness(1.02)', from: '#7ad7ff', to: '#3a6cff' },
  { id: 'vivid', name: 'Vivid', filter: 'saturate(1.5) contrast(1.08)', from: '#ff2d55', to: '#ff9500' },
  { id: 'dream', name: 'Dream', filter: 'saturate(1.12) brightness(1.1)', from: '#ffb3d9', to: '#a78bfa' },
  { id: 'glow', name: 'Glow', filter: 'brightness(1.12) saturate(1.2) contrast(0.95)', from: '#ffe27a', to: '#ff9f0a' },
]

const MAX_SHOTS = 40
const RECORDING_SUPPORTED = typeof window !== 'undefined' && typeof window.MediaRecorder !== 'undefined'

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
      return 'A camera is not available right now. Try again with the default camera.'
    default:
      return error instanceof Error && error.message
        ? error.message
        : 'The camera could not be started. Please try again.'
  }
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function formatDuration(ms: number) {
  const total = Math.max(0, Math.round(ms / 1000))
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

export function PhotoBoothApp() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const requestRef = useRef(0)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const recordFrameRef = useRef<number | null>(null)
  const recordingStartRef = useRef(0)
  const flashTimer = useRef<number | null>(null)
  const noticeTimer = useRef<number | null>(null)
  const stripRef = useRef<HTMLDivElement>(null)

  const [status, setStatus] = useState<BoothStatus>('starting')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<BoothMode>('camera')
  const [effectId, setEffectId] = useState('normal')
  const [effectsOpen, setEffectsOpen] = useState(false)
  const [effectPreview, setEffectPreview] = useState<string | null>(null)
  const [shots, setShots] = useState<Shot[]>([])
  const [preview, setPreview] = useState<Shot | null>(null)
  const [flash, setFlash] = useState(false)
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [notice, setNotice] = useState('')

  const activeEffect = useMemo(
    () => EFFECTS.find((effect) => effect.id === effectId) ?? EFFECTS[0],
    [effectId],
  )

  const showNotice = useCallback((message: string) => {
    setNotice(message)
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current)
    noticeTimer.current = window.setTimeout(() => setNotice(''), 3200)
  }, [])

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }, [])

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported')
      return
    }
    const request = ++requestRef.current
    setStatus('starting')
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
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
          /* autoplay usually succeeds because the app is opened by a click */
        }
      }
      setStatus('live')
    } catch (err) {
      if (request !== requestRef.current) return
      stopTracks()
      setStatus('error')
      setError(describeCameraError(err))
    }
  }, [stopTracks])

  // Photo Booth starts its camera as soon as the app opens. The short delay
  // also avoids a duplicate request during React StrictMode's dev remount.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void startCamera()
    }, 160)
    return () => window.clearTimeout(timer)
  }, [startCamera])

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
      if (recordFrameRef.current) cancelAnimationFrame(recordFrameRef.current)
      streamRef.current?.getTracks().forEach((track) => track.stop())
      if (flashTimer.current) window.clearTimeout(flashTimer.current)
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current)
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
    if (!effectsOpen && !preview) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      if (preview) setPreview(null)
      else setEffectsOpen(false)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [effectsOpen, preview])

  useEffect(() => {
    const strip = stripRef.current
    if (strip) strip.scrollTo({ left: strip.scrollWidth, behavior: 'smooth' })
  }, [shots.length])

  const addShot = useCallback((shot: Omit<Shot, 'id' | 'createdAt'>) => {
    setShots((previous) => {
      const next = [
        ...previous,
        {
          ...shot,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: Date.now(),
        },
      ]
      next.slice(0, Math.max(0, next.length - MAX_SHOTS)).forEach((old) => {
        if (old.kind === 'video') URL.revokeObjectURL(old.url)
      })
      return next.slice(-MAX_SHOTS)
    })
  }, [])

  const grabFrame = useCallback(
    (withFilter: boolean) => {
      const video = videoRef.current
      if (!video || !video.videoWidth || !video.videoHeight) return null
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      if (!context) return null
      if (withFilter && activeEffect.filter !== 'none') context.filter = activeEffect.filter
      context.translate(canvas.width, 0)
      context.scale(-1, 1)
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL('image/jpeg', 0.93)
    },
    [activeEffect],
  )

  const capturePhoto = () => {
    const url = grabFrame(true)
    if (!url) return
    addShot({ kind: 'photo', url })
    setFlash(true)
    if (flashTimer.current) window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setFlash(false), 260)
  }

  const stopRecording = () => {
    const recorder = recorderRef.current
    if (!recorder || recorder.state === 'inactive') return
    recorder.stop()
  }

  const startRecording = () => {
    const video = videoRef.current
    const rawStream = streamRef.current
    if (!video || !rawStream || !video.videoWidth) return
    if (typeof MediaRecorder === 'undefined') {
      showNotice('Video recording is not supported in this browser.')
      return
    }

    let recordingStream: MediaStream = rawStream
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')

    // Record through a canvas so the mirrored preview and selected effect are
    // baked into the clip, matching what the user sees while recording.
    if (context && typeof canvas.captureStream === 'function') {
      const draw = () => {
        context.save()
        if (activeEffect.filter !== 'none') context.filter = activeEffect.filter
        context.translate(canvas.width, 0)
        context.scale(-1, 1)
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        context.restore()
        recordFrameRef.current = requestAnimationFrame(draw)
      }
      draw()
      recordingStream = canvas.captureStream(30)
    } else if (activeEffect.filter !== 'none') {
      showNotice('Effects can only be applied to photos in this browser.')
    }

    try {
      const mimeType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(
        (type) => !MediaRecorder.isTypeSupported || MediaRecorder.isTypeSupported(type),
      )
      const recorder = new MediaRecorder(recordingStream, mimeType ? { mimeType } : undefined)
      chunksRef.current = []
      recordingStartRef.current = Date.now()
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        if (recordFrameRef.current) {
          cancelAnimationFrame(recordFrameRef.current)
          recordFrameRef.current = null
        }
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' })
        chunksRef.current = []
        recorderRef.current = null
        setRecording(false)
        setElapsed(0)
        if (blob.size > 0) {
          addShot({
            kind: 'video',
            url: URL.createObjectURL(blob),
            duration: Math.max(1000, Date.now() - recordingStartRef.current),
          })
        }
      }
      recorder.onerror = () => {
        if (recordFrameRef.current) {
          cancelAnimationFrame(recordFrameRef.current)
          recordFrameRef.current = null
        }
        setRecording(false)
        showNotice('Recording stopped unexpectedly. Please try again.')
      }
      recorder.start(250)
      recorderRef.current = recorder
      setRecording(true)
    } catch {
      if (recordFrameRef.current) {
        cancelAnimationFrame(recordFrameRef.current)
        recordFrameRef.current = null
      }
      showNotice('Video recording could not start on this camera.')
    }
  }

  const handleShutter = () => {
    if (status !== 'live' || mode === 'library') return
    if (mode === 'camera') capturePhoto()
    else if (recording) stopRecording()
    else startRecording()
  }

  const toggleEffects = () => {
    if (effectsOpen) {
      setEffectsOpen(false)
      return
    }
    if (mode === 'library') return
    setEffectPreview(status === 'live' ? grabFrame(false) : null)
    setEffectsOpen(true)
  }

  const switchMode = (next: BoothMode) => {
    if (recording) return
    setMode(next)
    setEffectsOpen(false)
  }

  const deleteShot = (shot: Shot) => {
    setShots((previous) => previous.filter((item) => item.id !== shot.id))
    if (shot.kind === 'video') URL.revokeObjectURL(shot.url)
    setPreview(null)
  }

  const shutterLabel =
    mode === 'video'
      ? recording
        ? 'Stop recording'
        : 'Start recording'
      : 'Take photo'

  const statusLabel =
    status === 'live'
      ? recording
        ? 'Recording'
        : 'Live'
      : status === 'starting'
        ? 'Starting camera'
        : status === 'error'
          ? 'Camera unavailable'
          : status === 'unsupported'
            ? 'Camera unsupported'
            : 'Camera off'

  return (
    <div
      data-photobooth
      data-photobooth-status={status}
      className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#1c1c1e] text-white"
    >
      <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            status === 'live' && mode !== 'library' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: 'scaleX(-1)',
            filter: activeEffect.filter,
          }}
        />

        {status === 'live' && mode !== 'library' && (
          <>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[110px] bg-gradient-to-t from-black/35 to-transparent" />
            {recording && (
              <div className="absolute left-[14px] top-[12px] flex items-center gap-[7px] rounded-full border border-white/10 bg-black/45 px-[9px] py-[4px] text-[10px] font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur-md">
                <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-[#ff453a] shadow-[0_0_8px_rgba(255,69,58,0.8)]" />
                Rec {formatDuration(elapsed)}
              </div>
            )}
            {mode === 'video' && !recording && (
              <div className="pointer-events-none absolute left-[14px] top-[12px] flex items-center gap-[6px] rounded-full border border-white/10 bg-black/35 px-[9px] py-[4px] text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/65 backdrop-blur-md">
                <Video className="h-[10px] w-[10px]" />
                Video mode
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
              transition={{ duration: 0.26, ease: 'easeOut' }}
              className="pointer-events-none absolute inset-0 z-20 bg-white"
            />
          )}
        </AnimatePresence>

        {mode === 'library' && (
          <div
            data-photobooth-gallery
            className="absolute inset-0 z-[12] overflow-y-auto bg-[#111113] p-[14px]"
          >
            {shots.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-[10px] text-white/30">
                <span className="grid h-[56px] w-[56px] place-items-center rounded-[17px] border border-white/10 bg-white/[0.04]">
                  <ImageIcon className="h-[24px] w-[24px]" strokeWidth={1.3} />
                </span>
                <p className="text-[13px] font-medium text-white/45">No captures yet</p>
                <p className="text-[10.5px] text-white/25">
                  Switch to Photo mode and press the red shutter to start.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-[8px] sm:grid-cols-4 lg:grid-cols-5">
                {[...shots].reverse().map((shot, index) => (
                  <button
                    key={shot.id}
                    onClick={() => setPreview(shot)}
                    aria-label={`Open ${shot.kind} capture ${index + 1}`}
                    className="group relative aspect-[4/3] overflow-hidden rounded-[5px] border border-white/10 bg-black text-left shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-transform hover:scale-[1.02] hover:border-white/25"
                  >
                    <ShotVisual shot={shot} />
                    <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/75 to-transparent px-[7px] pb-[5px] pt-[14px] text-[9px] text-white/70">
                      <span>{formatTime(shot.createdAt)}</span>
                      <span className="uppercase tracking-[0.08em] text-white/45">
                        {shot.kind === 'video' ? formatDuration(shot.duration ?? 0) : 'Photo'}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {status !== 'live' && mode !== 'library' && (
          <div className="absolute inset-0 z-[14] flex flex-col items-center justify-center px-[28px] text-center">
            {status === 'starting' ? (
              <div className="flex flex-col items-center gap-[12px]">
                <Loader2 className="h-[27px] w-[27px] animate-spin text-white/65" strokeWidth={1.6} />
                <p className="text-[13px] font-medium text-white/80">{statusLabel}…</p>
                <p className="text-[10.5px] text-white/35">
                  Approve the browser camera permission if prompted.
                </p>
              </div>
            ) : status === 'error' ? (
              <div className="flex w-full max-w-[400px] flex-col items-center gap-[10px] rounded-[16px] border border-white/10 bg-white/[0.04] px-[24px] py-[22px]">
                <span className="grid h-[46px] w-[46px] place-items-center rounded-full bg-[#ff453a]/[0.12] text-[#ff6961]">
                  <ShieldAlert className="h-[22px] w-[22px]" strokeWidth={1.7} />
                </span>
                <p className="text-[14px] font-semibold">{statusLabel}</p>
                <p className="text-[11px] leading-[17px] text-white/45">{error}</p>
                <button
                  onClick={() => void startCamera()}
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
                  Photo Booth needs access to a camera. Open this desktop over localhost or HTTPS in a
                  modern browser to use it.
                </p>
              </div>
            ) : (
              <>
                <span className="grid h-[70px] w-[70px] place-items-center rounded-[20px] border border-white/10 bg-white/[0.05] text-white/60">
                  <Camera className="h-[31px] w-[31px]" strokeWidth={1.4} />
                </span>
                <p className="mt-[15px] text-[15px] font-semibold">Camera is off</p>
                <p className="mt-[5px] max-w-[320px] text-[10.5px] leading-[16px] text-white/40">
                  Start the camera to see a live preview. Your browser will ask for permission the
                  first time.
                </p>
                <button
                  onClick={() => void startCamera()}
                  className="mt-[14px] flex items-center gap-[6px] rounded-[8px] bg-white px-[15px] py-[7px] text-[11.5px] font-semibold text-black transition hover:bg-white/90 active:scale-[0.98]"
                >
                  <Video className="h-[12px] w-[12px]" strokeWidth={2.2} />
                  Turn On Camera
                </button>
              </>
            )}
          </div>
        )}

        <AnimatePresence>
          {notice && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-none absolute left-1/2 top-[12px] z-[26] -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/65 px-[12px] py-[5px] text-[10px] font-medium text-white/80 backdrop-blur-md"
            >
              {notice}
            </motion.div>
          )}
        </AnimatePresence>


      </div>

      <div
        data-photobooth-filmstrip
        ref={stripRef}
        className="flex h-[80px] shrink-0 items-center gap-[5px] overflow-x-auto border-t border-white/[0.06] bg-[#141416] px-[10px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {shots.length === 0 ? (
          <div className="flex w-full items-center justify-center gap-[7px] text-[10px] text-white/25">
            <ImageIcon className="h-[13px] w-[13px]" strokeWidth={1.6} />
            Your captures appear here
          </div>
        ) : (
          shots.map((shot, index) => (
            <motion.button
              key={shot.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30, mass: 0.7 }}
              onClick={() => setPreview(shot)}
              aria-label={`Open capture ${index + 1}`}
              className="group relative h-[58px] w-[77px] shrink-0 overflow-hidden rounded-[3px] border border-white/15 bg-black shadow-[0_2px_6px_rgba(0,0,0,0.35)] transition-colors hover:border-white/45"
            >
              <ShotVisual shot={shot} />
              {shot.kind === 'video' && (
                <span className="absolute bottom-[3px] right-[3px] rounded-[2px] bg-black/65 px-[3px] py-[1px] text-[8px] font-medium text-white/80">
                  {formatDuration(shot.duration ?? 0)}
                </span>
              )}
            </motion.button>
          ))
        )}
      </div>

      <div className="flex h-[66px] shrink-0 items-center gap-[12px] border-t border-white/[0.08] bg-[#1b1b1d] px-[14px]">
        <div className="flex flex-1 items-center">
          <div className="flex items-center gap-[3px] rounded-[7px] bg-black/25 p-[3px] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.05)]">
            <ModeButton
              active={mode === 'library'}
              disabled={recording}
              label="Library"
              onClick={() => switchMode('library')}
            >
              <LayoutGrid className="h-[13px] w-[13px]" strokeWidth={2} />
            </ModeButton>
            <ModeButton
              active={mode === 'camera'}
              disabled={recording}
              label="Photo mode"
              onClick={() => switchMode('camera')}
            >
              <Camera className="h-[14px] w-[14px]" strokeWidth={2} />
            </ModeButton>
            <ModeButton
              active={mode === 'video'}
              disabled={recording || !RECORDING_SUPPORTED}
              label="Video mode"
              onClick={() => switchMode('video')}
            >
              <Video className="h-[14px] w-[14px]" strokeWidth={2} />
            </ModeButton>
          </div>
        </div>

        <div className="flex flex-1 justify-center">
          <button
            onClick={handleShutter}
            disabled={status !== 'live' || mode === 'library' || effectsOpen}
            aria-label={shutterLabel}
            data-photobooth-shutter
            className="grid h-[50px] w-[50px] place-items-center rounded-full border-[3px] border-white/85 bg-[#ff3b30] shadow-[0_3px_12px_rgba(255,59,48,0.3)] transition-all hover:bg-[#ff4f45] active:scale-[0.94] disabled:cursor-default disabled:border-white/25 disabled:bg-white/20 disabled:shadow-none"
          >
            {mode === 'video' && recording ? (
              <Square className="h-[16px] w-[16px] fill-white text-white" />
            ) : mode === 'video' ? (
              <Video className="h-[19px] w-[19px] text-white" strokeWidth={2.2} />
            ) : (
              <Camera className="h-[19px] w-[19px] text-white" strokeWidth={2.2} />
            )}
          </button>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <button
            onClick={toggleEffects}
            disabled={mode === 'library' || recording || status !== 'live'}
            aria-label="Effects"
            aria-expanded={effectsOpen}
            className="relative flex h-[27px] items-center gap-[6px] rounded-[6px] border border-white/15 bg-white/[0.06] px-[12px] text-[10.5px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-default disabled:opacity-35"
          >
            <Sparkles className="h-[12px] w-[12px]" strokeWidth={2} />
            Effects
            {activeEffect.id !== 'normal' && (
              <span className="absolute right-[4px] top-[4px] h-[4px] w-[4px] rounded-full bg-[#0a84ff]" />
            )}
          </button>
        </div>
      </div>


      <AnimatePresence>
        {effectsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setEffectsOpen(false)}
              className="absolute inset-0 z-30 bg-black/45"
            />
            <motion.div
              data-photobooth-effects
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.8 }}
              className="absolute bottom-[76px] right-[14px] z-40 max-h-[calc(100%-92px)] w-[310px] max-w-[calc(100%-28px)] overflow-hidden rounded-[12px] border border-white/15 bg-[#232326]/[0.97] shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] px-[12px] py-[9px]">
                <div>
                  <p className="text-[12px] font-semibold text-white/85">Effects</p>
                  <p className="text-[9px] text-white/30">Baked into new photos and videos</p>
                </div>
                <button
                  onClick={() => setEffectsOpen(false)}
                  aria-label="Close effects"
                  className="grid h-[22px] w-[22px] place-items-center rounded-full bg-white/[0.07] text-white/50 transition-colors hover:bg-white/15 hover:text-white"
                >
                  <X className="h-[12px] w-[12px]" strokeWidth={2.2} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-[7px] overflow-y-auto p-[10px]">
                {EFFECTS.map((effect) => {
                  const selected = effect.id === activeEffect.id
                  return (
                    <button
                      key={effect.id}
                      onClick={() => setEffectId(effect.id)}
                      aria-label={`Effect ${effect.name}`}
                      aria-pressed={selected}
                      className={`group rounded-[7px] border p-[3px] text-left transition-colors ${
                        selected
                          ? 'border-[#0a84ff] bg-[#0a84ff]/15'
                          : 'border-transparent hover:bg-white/[0.06]'
                      }`}
                    >
                      <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-[4px] bg-[#151517]">
                        {effectPreview ? (
                          <img
                            src={effectPreview}
                            alt=""
                            className="h-full w-full object-cover"
                            style={{ filter: effect.filter }}
                          />
                        ) : (
                          <span
                            className="grid h-full w-full place-items-center"
                            style={{
                              background: `linear-gradient(135deg, ${effect.from}, ${effect.to})`,
                              filter: effect.filter,
                            }}
                          >
                            <Camera className="h-[15px] w-[15px] text-white/55" strokeWidth={1.7} />
                          </span>
                        )}
                        {selected && (
                          <span className="absolute right-[3px] top-[3px] grid h-[14px] w-[14px] place-items-center rounded-full bg-[#0a84ff] text-white shadow">
                            <Check className="h-[9px] w-[9px]" strokeWidth={3} />
                          </span>
                        )}
                      </span>
                      <span
                        className={`mt-[3px] block truncate px-[2px] text-[9.5px] ${
                          selected ? 'font-semibold text-white/85' : 'text-white/45'
                        }`}
                      >
                        {effect.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {preview && (
          <motion.div
            data-photobooth-preview
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setPreview(null)}
            className="absolute inset-0 z-50 flex flex-col bg-black/[0.95] backdrop-blur-md"
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
                  download={`PhotoBooth-${preview.id}.${preview.kind === 'photo' ? 'jpg' : 'webm'}`}
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
                  alt="Photo Booth capture"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={(event) => event.stopPropagation()}
                  className="max-h-full max-w-full rounded-[6px] object-contain shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
                />
              ) : (
                <video
                  key={preview.id}
                  src={preview.url}
                  controls
                  autoPlay
                  onClick={(event) => event.stopPropagation()}
                  className="max-h-full max-w-full rounded-[6px] object-contain shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ModeButton({
  active,
  disabled,
  label,
  onClick,
  children,
}: {
  active: boolean
  disabled?: boolean
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`grid h-[24px] w-[27px] place-items-center rounded-[5px] transition-colors ${
        active
          ? 'bg-[#0a84ff] text-white shadow-[0_1px_3px_rgba(0,0,0,0.4)]'
          : 'text-white/45 hover:bg-white/10 hover:text-white/80'
      } disabled:cursor-default disabled:opacity-45`}
    >
      {children}
    </button>
  )
}

function ShotVisual({ shot }: { shot: Shot }) {
  if (shot.kind === 'video') {
    return (
      <>
        <video
          src={shot.url}
          muted
          preload="metadata"
          className="h-full w-full object-cover"
        />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-[20px] w-[20px] place-items-center rounded-full border border-white/20 bg-black/45">
            <Play className="ml-[1px] h-[8px] w-[8px] fill-white text-white" />
          </span>
        </span>
      </>
    )
  }
  return <img src={shot.url} alt="" className="h-full w-full object-cover" />
}
