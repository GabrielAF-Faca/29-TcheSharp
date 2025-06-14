"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

// Tipo para garantir que só 'user' ou 'environment' sejam usados
type FacingMode = "user" | "environment";

const CameraWithModeSwitcher: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>("environment");

  // Hook para iniciar e reiniciar a câmera com a lógica de fallback CORRIGIDA
  useEffect(() => {
    // Se uma foto já foi tirada, não há necessidade de iniciar a câmera.
    if (photoDataUrl) return;

    // Garante que qualquer stream antigo seja parado antes de iniciar um novo.
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    const startCamera = async () => {
      setError(null);
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Seu navegador não suporta a API de mídia.");
        return;
      }

      // Tenta primeiro a câmera preferida (traseira por padrão).
      const primaryConstraint = { video: { facingMode: facingMode } };

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(primaryConstraint);
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.warn("Falha ao obter a câmera principal:", err);

        // --- LÓGICA DE FALLBACK ---
        // Se a câmera preferida não for encontrada (erro comum em desktops),
        // tenta novamente pedindo QUALQUER câmera de vídeo.
        if (err instanceof DOMException && err.name === "NotFoundError") {
          console.log("Câmera principal não encontrada. Tentando fallback...");
          const fallbackConstraint = { video: true };
          try {
            const mediaStream = await navigator.mediaDevices.getUserMedia(fallbackConstraint);
            setStream(mediaStream);
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
            }
          } catch (fallbackErr) {
            console.error("Falha no fallback. Nenhuma câmera encontrada.", fallbackErr);
            setError("Nenhuma câmera foi encontrada no seu dispositivo.");
          }
        } else {
          // Trata outros erros, como permissão negada.
          setError("Não foi possível acessar a câmera. Verifique as permissões.");
        }
      }
    };

    startCamera();

    // Função de limpeza para parar a câmera ao desmontar o componente.
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode, photoDataUrl]); // Dependências do useEffect.

  // A lógica para tirar foto permanece a mesma.
  const takePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
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
  };

  const handleSwitchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  // O JSX permanece o mesmo.
  return (
    <div className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-black text-white">
      {error && (
        <p className="absolute top-5 left-1/2 z-20 w-11/12 -translate-x-1/2 rounded-lg bg-red-600/80 p-3 text-center text-white">
          {error}
        </p>
      )}

      {photoDataUrl ? (
        // --- TELA DE PREVISUALIZAÇÃO DA FOTO ---
        <div className="flex h-full w-full flex-col items-center justify-center">
          <img src={photoDataUrl} alt="Foto Capturada" className="max-h-[calc(100%-120px)] max-w-full object-contain" />
          <div className="absolute bottom-8 z-10 flex gap-5">
            <button
              onClick={retakePhoto}
              className="rounded-lg bg-gray-700 py-3 px-6 font-bold text-white transition-colors hover:bg-gray-600"
            >
              Tirar Outra
            </button>
            <a
              href={photoDataUrl}
              download="captura.png"
              className="rounded-lg bg-blue-600 py-3 px-6 font-bold text-white no-underline transition-colors hover:bg-blue-500"
            >
              Salvar
            </a>
          </div>
        </div>
      ) : (
        // --- TELA DA CÂMERA ---
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
      )}

      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};

export default CameraWithModeSwitcher;
