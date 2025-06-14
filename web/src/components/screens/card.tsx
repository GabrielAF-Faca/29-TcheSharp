'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function Card() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="p-6">
      <div className="relative h-64 w-full rounded-xl overflow-hidden">
        <Image
          src="/louvre.jpg"
          alt="Museu do Louvre em Paris"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black mt-4">
          Museu Louvre
        </h1>

        <p className="mt-2 text-neutral-600">
          O Museu do Louvre, localizado em Paris, França, é um dos maiores e mais visitados museus do mundo...
        </p>

        <button
          onClick={handleToggle}
          className="mt-4 flex items-center text-[#6B4F35] font-semibold"
        >
          <span>{isExpanded ? 'Ler menos' : 'Ler mais'}</span>
          <ChevronDown
            className={`h-5 w-5 ml-1 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isExpanded && (
        <div>
          <div className='mb-6'>
            <h2 className="text-md font-medium">
              Contexto histórico
            </h2>
            <p className="mt-2 text-neutral-600">
              O Museu do Louvre, originalmente uma fortaleza construída no século XII, foi transformado em um palácio real e, posteriormente, em um museu público durante a Revolução Francesa.
            </p>
          </div>
          <div>
            <h2 className="text-md font-medium">
              Curiosidades
            </h2>
            <p className="mt-2 text-neutral-600">
              O Museu do Louvre, originalmente uma fortaleza construída no século XII, foi transformado em um palácio real e, posteriormente, em um museu público durante a Revolução Francesa.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};