"use client";

import { useState, useRef, useEffect } from "react";
import {
  Video,
  Upload,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Camera,
  StopCircle,
} from "lucide-react";

interface VideoPitchRecorderProps {
  maxDurationSeconds?: number;
  maxSizeBytes?: number;
  onVideoReady: (videoData: {
    url: string;
    duration: number;
    size: number;
    fileName?: string;
  } | null) => void;
}

export function VideoPitchRecorder({
  maxDurationSeconds = 120,
  maxSizeBytes = 104857600, // 100 MB
  onVideoReady,
}: VideoPitchRecorderProps) {
  const [mode, setMode] = useState<"record" | "upload">("record");
  const [isRecording, setIsRecording] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoSize, setVideoSize] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Limpeza de stream ao desmontar
  useEffect(() => {
    return () => {
      stopCamera();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  function stopCamera() {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  }

  async function startCamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: true,
      });
      mediaStreamRef.current = stream;
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
        liveVideoRef.current.play();
      }
    } catch (err: any) {
      setError("Não foi possível acessar sua câmera/microfone. Verifique as permissões ou envie um arquivo de vídeo.");
    }
  }

  async function handleStartRecording() {
    setError(null);
    chunksRef.current = [];
    if (!mediaStreamRef.current) {
      await startCamera();
    }
    if (!mediaStreamRef.current) return;

    try {
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";
      const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const recordedBlob = new Blob(chunksRef.current, { type: "video/webm" });
        if (recordedBlob.size > maxSizeBytes) {
          setError(`O vídeo excedeu o limite de ${Math.round(maxSizeBytes / (1024 * 1024))} MB.`);
          return;
        }

        const url = URL.createObjectURL(recordedBlob);
        setPreviewUrl(url);
        setVideoSize(recordedBlob.size);
        setFileName("pitch-gravado.webm");
        stopCamera();

        // Simula upload com progresso rápido
        simulateUpload(url, secondsElapsed, recordedBlob.size, "pitch-gravado.webm");
      };

      recorder.start(1000);
      setIsRecording(true);
      setSecondsElapsed(0);

      timerIntervalRef.current = setInterval(() => {
        setSecondsElapsed((prev) => {
          const next = prev + 1;
          if (next >= maxDurationSeconds) {
            handleStopRecording();
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      setError("Erro ao iniciar o gravador de vídeo.");
    }
  }

  function handleStopRecording() {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }

  function simulateUpload(url: string, duration: number, size: number, name: string) {
    setUploadProgress(10);
    let current = 10;
    const interval = setInterval(() => {
      current += 30;
      if (current >= 100) {
        clearInterval(interval);
        setUploadProgress(100);
        setVideoDuration(duration);
        onVideoReady({
          url,
          duration,
          size,
          fileName: name,
        });
      } else {
        setUploadProgress(current);
      }
    }, 150);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Por favor selecione um arquivo de vídeo válido (.mp4, .webm, .mov).");
      return;
    }

    if (file.size > maxSizeBytes) {
      setError(`O arquivo selecionado (${(file.size / (1024 * 1024)).toFixed(1)} MB) ultrapassa o limite de 100 MB.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    // Checar duração do vídeo
    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";
    tempVideo.src = objectUrl;
    tempVideo.onloadedmetadata = () => {
      const dur = Math.round(tempVideo.duration);
      if (dur > maxDurationSeconds) {
        setError(`A duração do vídeo (${dur}s) ultrapassa o limite de ${maxDurationSeconds} segundos.`);
        URL.revokeObjectURL(objectUrl);
        return;
      }

      setPreviewUrl(objectUrl);
      setVideoSize(file.size);
      setVideoDuration(dur);
      setFileName(file.name);
      simulateUpload(objectUrl, dur, file.size, file.name);
    };
  }

  function handleReset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setUploadProgress(null);
    setSecondsElapsed(0);
    setVideoDuration(0);
    setVideoSize(0);
    setFileName(null);
    setError(null);
    onVideoReady(null);
    stopCamera();
  }

  const remainingSeconds = maxDurationSeconds - secondsElapsed;

  return (
    <div className="video-pitch-box">
      <div className="video-pitch-header">
        <div className="pitch-title-wrap">
          <Sparkles size={18} className="text-amber" aria-hidden="true" />
          <div>
            <strong>Vídeo de Apresentação (Pitch Curto de até 2 minutos)</strong>
            <p className="pitch-subtitle">
              Opcional e acessível. Destaque sua energia, trajetórias e motivação para a vaga em até 120s.
            </p>
          </div>
        </div>

        {!previewUrl && (
          <div className="pitch-mode-tabs" role="tablist">
            <button
              type="button"
              className={`tab-btn ${mode === "record" ? "active" : ""}`}
              onClick={() => {
                setMode("record");
                setError(null);
              }}
              disabled={isRecording}
            >
              <Camera size={14} /> Gravar pela Câmera
            </button>
            <button
              type="button"
              className={`tab-btn ${mode === "upload" ? "active" : ""}`}
              onClick={() => {
                setMode("upload");
                stopCamera();
                setError(null);
              }}
              disabled={isRecording}
            >
              <Upload size={14} /> Enviar Arquivo
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="pitch-error-alert" role="alert">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* ÁREA DE GRAVAÇÃO / UPLOAD / PREVIEW */}
      <div className="pitch-media-viewport">
        {previewUrl ? (
          // VISUALIZAÇÃO PRÉVIA (PLAYER)
          <div className="preview-container">
            <video
              src={previewUrl}
              controls
              playsInline
              className="preview-video"
              aria-label="Pré-visualização do seu vídeo de apresentação"
            />
            <div className="preview-meta-row">
              <span className="badge-duration">
                <Clock size={14} /> {videoDuration || secondsElapsed}s / {maxDurationSeconds}s
              </span>
              <span className="badge-filesize">
                {(videoSize / (1024 * 1024)).toFixed(1)} MB
              </span>
              <button
                type="button"
                className="button-link-danger"
                onClick={handleReset}
              >
                <RotateCcw size={14} /> Regravar ou trocar vídeo
              </button>
            </div>

            {uploadProgress !== null && uploadProgress < 100 && (
              <div className="upload-progress-container">
                <div className="progress-labels">
                  <span>Enviando vídeo para o servidor seguro...</span>
                  <strong>{uploadProgress}%</strong>
                </div>
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadProgress === 100 && (
              <div className="upload-success-notice">
                <CheckCircle2 size={16} className="text-success" />
                <span>Vídeo anexado e pronto para o envio da candidatura.</span>
              </div>
            )}
          </div>
        ) : mode === "record" ? (
          // GRAVADOR COM CÂMERA
          <div className="camera-recorder-wrap">
            <video
              ref={liveVideoRef}
              autoPlay
              muted
              playsInline
              className={`live-camera-feed ${isRecording ? "recording" : ""}`}
            />

            {!isRecording && !mediaStreamRef.current && (
              <div className="camera-placeholder">
                <Video size={48} className="text-muted" aria-hidden="true" />
                <p>Grave um vídeo curto de apresentação diretamente pelo seu navegador.</p>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={startCamera}
                >
                  <Camera size={16} /> Ativar Câmera
                </button>
              </div>
            )}

            {mediaStreamRef.current && (
              <div className="recorder-hud">
                {isRecording ? (
                  <div className="hud-recording-bar">
                    <span className="recording-dot-pulse" aria-hidden="true" />
                    <span className="timer-text">
                      Gravando: {secondsElapsed}s / Restam: {remainingSeconds}s
                    </span>
                    <button
                      type="button"
                      className="button button-danger-compact"
                      onClick={handleStopRecording}
                    >
                      <StopCircle size={16} /> Finalizar Gravação
                    </button>
                  </div>
                ) : (
                  <div className="hud-ready-bar">
                    <span>Câmera pronta! Posicione-se bem e clique em Iniciar.</span>
                    <button
                      type="button"
                      className="button button-primary-compact"
                      onClick={handleStartRecording}
                    >
                      <Play size={16} /> Iniciar Gravação (120s)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // UPLOAD DE ARQUIVO
          <div className="upload-dropzone">
            <label htmlFor="video-file-input" className="dropzone-label">
              <Upload size={36} className="text-amber" aria-hidden="true" />
              <strong>Clique ou arraste um arquivo de vídeo</strong>
              <span>Formatos aceitos: MP4, WebM ou MOV (máx. 100 MB e até 120s)</span>
              <input
                id="video-file-input"
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="sr-only"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        )}
      </div>

      {/* AVISO DE ACESSIBILIDADE E PRIVACIDADE LGPD */}
      <div className="pitch-footer-disclaimer">
        <p>
          🔒 <strong>Acesso e Privacidade:</strong> O vídeo é reproduzido exclusivamente pela empresa responsável pela vaga e pelo próprio candidato. O envio é 100% facultativo e não emprega reconhecimento facial ou inteligência artificial biométrica.
        </p>
      </div>
    </div>
  );
}
