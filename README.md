# Loci - Além do Olhar

## Integrantes
- Alisson de Almeida Lamarque (__Software Engineer__)
- Gabriel Azenha Fachim (__Back-End Developer__)
- Gustavo Sefrin Gomes (__Software Engineer__)
- Matheus Machado Faccin (__Back-End Developer__)
- Maurício Pereira Braga (__Front-End Developer__)

<br/>

## Tema / Área do problema
__Inteligência Artificial Aplicada ao que sua Imaginação Permitir__

<br/>

## Problema a ser Resolvido
Turistas e visitantes frequentemente enfrentam dificuldades para obter informações históricas, culturais e contextuais sobre os locais que estão explorando 
como monumentos, esculturas, construções, pontos turísticos e até elementos urbanos. Esse desafio se intensifica em regiões onde o acesso à informação é 
limitado ou quando não há guias disponíveis.
Diante deste desafio, propomos o desenvolvimento de um sistema acessível que permita a qualquer pessoa obter descrições detalhadas, contexto histórico-cultural e 
curiosidades relevantes sobre o que está sendo visualizado, utilizando apenas uma imagem e a localização geográfica como ponto de partida.

<br/>

## Solução Proposta
Desenvolver um sistema web inteligente que a partir de uma imagem e uma localização geográfica, seja capaz de:
- Identificar o que está sendo mostrado na imagem;
- Gerar uma descrição contextual do que está sendo mostrado;
- Fornecer informações, históricas, culturais e curiosidades (se for o caso);
- Entregar essas informações de forma acessível, simples e rápida para o usuário.

<br/>

<table>
  <tr>
    <td>
      <h1>Loci</h1>
      <p>Loci é um sistema inteligente que transforma imagens e localização geográfica em descrições ricas, históricas e culturais, permitindo que qualquer pessoa compreenda o que está vendo, onde está, e por que aquele lugar é importante. Através da combinação de Visão Computacional, Geolocalização e IA Generativa, o Loci identifica o conteúdo de uma imagem (como monumentos, construções ou esculturas) e, com base na localização do usuário, gera um texto contextual personalizado, abordando: Descrição detalhada; Contexto histórico e cultural; e Curiosidades relevantes.</p>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/3c331178-678a-4232-a883-b7c2f8b7e3c2" width="600">
    </td>
  </tr>
</table>

<br/>

## Tecnologias Utilizadas
- __Back-End__:  
  - Python
  - FastAPI
  - Google Maps API
  - Gemini API  
- __Front-End__:
  - JavaScript/TypeScript
  - Next.js
  - Tailwind

<br/>

## Instalação e Execução
1. Clone o repositório
```bash
git clone 'https://github.com/GabrielAF-Faca/29-TcheSharp.git'
```
2. Navegue para a pasta api e instale os requerimentos
```bash
pip install requirements.txt
```
3. Troque o nome do arquivo .env.example para .env e preencha as chaves de API
```bash
MAPS_API_KEY=[KEY DA API DO GOOGLE MAPS]
GEMINI_KEY=[KEY DA API DO GEMINI]
```
4. Digite o seguinte comando no terminal
```bash
python -m uvicorn main:app --reload
```
