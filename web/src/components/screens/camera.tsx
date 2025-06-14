"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

type FacingMode = "user" | "environment";
type Coords = {
  latitude: number;
  longitude: number;
} | null;

const CameraWithModeSwitcher: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>("environment");

  const [coords, setCoords] = useState<Coords>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          setError("Permissão de localização negada. A foto será enviada sem as coordenadas.");
        }
      );
    } else {
      setError("Geolocalização não é suportada neste navegador.");
    }
  }, []); // Executa apenas uma vez

  useEffect(() => {
    if (photoDataUrl) return;

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    const startCamera = async () => {
      setError(null);
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Seu navegador não suporta a API de mídia.");
        return;
      }
      const primaryConstraint = { video: { facingMode } };
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(primaryConstraint);
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "NotFoundError") {
          const fallbackConstraint = { video: true };
          try {
            const mediaStream = await navigator.mediaDevices.getUserMedia(fallbackConstraint);
            setStream(mediaStream);
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
            }
          } catch {
            setError("Nenhuma câmera foi encontrada no seu dispositivo.");
          }
        } else {
          setError("Não foi possível acessar a câmera. Verifique as permissões.");
        }
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode, photoDataUrl]);

  const takePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9); 
        setPhotoDataUrl(dataUrl);
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
      }
    }
  }, [stream]);

  const retakePhoto = () => {
    setPhotoDataUrl(null);
    setSubmissionStatus(null);
  };

  const handleSwitchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };
  
  const dataURLtoBlob = (dataurl: string): Blob => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
        throw new Error("Invalid dataURL format");
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const handleSubmit = async () => {
    if (!photoDataUrl) {
      setError("Nenhuma foto para enviar.");
      return;
    }
    if (!coords) {
        setError("Coordenadas ainda não obtidas. Tente novamente em alguns segundos.");
        return;
    }

    setIsSubmitting(true);
    setError(null);
    setSubmissionStatus(null);

    try {
      const imageBlob = dataURLtoBlob(photoDataUrl);

      const formData = new FormData();
      formData.append("img", imageBlob, "captura.jpg");
      formData.append("linguagem", "pt-BR");
      formData.append("coords", JSON.stringify([coords.latitude, coords.longitude]));
      
      const response = await fetch("http://localhost:8000/api/v1/sistema", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Erro no servidor: ${response.statusText}`);
      }

      const data = await response.json(); 

      // Salva a resposta no localStorage
      // O localStorage só armazena strings, então usamos JSON.stringify
      localStorage.setItem('dados_foto', JSON.stringify(data));

      // Sucesso!
      setSubmissionStatus("success");
      console.log("Dados enviados com sucesso!", await response.json());

    } catch (err) {
      setSubmissionStatus("error");
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido ao enviar.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-black text-white">
      {error && (
        <p className={`absolute top-5 left-1/2 z-20 w-11/12 -translate-x-1/2 rounded-lg p-3 text-center text-white ${submissionStatus === 'error' ? 'bg-red-600/80' : 'bg-yellow-600/80'}`}>
          {error}
        </p>
      )}

      {submissionStatus === 'success' && (
         <div className="flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-2xl font-bold">✅</p>
            <p className="text-xl">Foto enviada com sucesso!</p>
            <button
              onClick={retakePhoto}
              className="rounded-lg bg-gray-700 py-3 px-6 font-bold text-white transition-colors hover:bg-gray-600"
            >
              Capturar Nova Foto
            </button>
         </div>
      )}

      {photoDataUrl && !submissionStatus ? (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <img src={photoDataUrl} alt="Foto Capturada" className="max-h-[calc(100%-120px)] max-w-full object-contain" />
          <div className="absolute bottom-8 z-10 flex gap-5">
            <button
              onClick={retakePhoto}
              disabled={isSubmitting}
              className="rounded-xl bg-neutral-700 py-3 px-6 font-bold text-white transition-colors cursor-pointerdisabled:cursor-not-allowed disabled:opacity-50"
            >
              Tirar Outra
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !coords}
              className="rounded-xl bg-[#6B4F35] py-3 px-6 font-bold text-white no-underline transition-colors disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </div>
      ) : null}

      {!photoDataUrl && !submissionStatus ? (
        <div className="relative h-full w-full">
          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover"></video>

          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleSwitchCamera}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-2xl transition-colors hover:bg-black/70"
              aria-label="Virar câmera"
            >
              🔄
            </button>
          </div>

          <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
            <button
              onClick={takePhoto}
              disabled={!stream}
              className="h-[70px] w-[70px] cursor-pointer rounded-full border-[5px] border-white/80 bg-white/40 transition-colors enabled:hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Tirar Foto"
            ></button>
          </div>
        </div>
      ) : null}

      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};

export default CameraWithModeSwitcher;