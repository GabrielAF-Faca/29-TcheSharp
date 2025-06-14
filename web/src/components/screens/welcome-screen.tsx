"use client";

import { LociLogo } from "../icons/loci-logo";
import Link from "next/link";

const WelcomeScreen = () => {
  return (
    <div
      className="relative flex h-screen w-screen flex-col bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/colosseum.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#311E17]/80 to-transparent" />

      <div className="relative z-10 flex h-full w-full flex-col p-6">
        <div className="absolute top-10 left-6">
          <LociLogo />
        </div>

        <div className="absolute top-1/4 left-[60%] w-60 -translate-x-1/2 transform">
          <div className="relative rounded-xl bg-black/70 p-4 text-center shadow-lg">
            <p className="text-sm">
              Estima-se que mais de 500 mil pessoas e 1 milhão de animais tenham morrido em espetáculos realizados no
              Coliseu...
            </p>
          </div>
        </div>

        <div className="flex-grow" />

        <div className="flex flex-col pb-8">
          <h1 className="text-left text-3xl font-light tracking-wide">O mundo e sua beleza</h1>
          <h2 className="text-left text-3xl font-bold">por outros olhos</h2>
          <Link
            className="mt-8 w-full max-w-sm rounded-xl cursor-pointer bg-[#6B4F35] text-center py-4 text-lg font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
            href={""}
          >
            Prosseguir
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
