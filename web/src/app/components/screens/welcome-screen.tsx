"use client";

import { LociLogo } from "../icons/loci-logo";

const WelcomeScreen = () => {
  return (
    <div
      className="relative flex h-screen w-screen flex-col bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/colosseum.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#311E17]/30" />

      <div className="relative z-10 flex h-full w-full flex-col p-6">
        <div className="absolute top-10 left-6">
          <LociLogo />
        </div>

        <div className="absolute top-1/4 left-1/2 w-3/4 -translate-x-1/2 transform">
          <div className="relative rounded-xl bg-gray-800/90 p-4 text-center shadow-lg">
            <p className="text-sm">
              Estima-se que mais de 500 mil pessoas e 1 milhão de animais tenham morrido em espetáculos realizados no
              Coliseu...
            </p>
            <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 transform bg-gray-800/90"></div>
          </div>
        </div>

        <div className="flex-grow" />

        <div className="flex flex-col items-center pb-8">
          <h1 className="text-center text-3xl font-light tracking-wide">O mundo e sua beleza</h1>
          <h2 className="text-center text-3xl font-bold">por outros olhos</h2>
          <button className="mt-8 w-full max-w-sm rounded-full bg-[#6B4F35] py-4 text-lg font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 active:scale-95">
            Prosseguir
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
