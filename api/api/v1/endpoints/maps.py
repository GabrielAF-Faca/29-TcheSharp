from dotenv import load_dotenv

import googlemaps
import os


load_dotenv()

Maps_API_KEY = os.getenv("MAPS_API_KEY")

gmaps = googlemaps.Client(key=Maps_API_KEY)

def get_address_and_places_info_google(latitude, longitude):
    try:
        # Geocodificação reversa
        reverse_geocode_result = gmaps.reverse_geocode((latitude, longitude), language='pt-BR')

        address_info = {
            "pontos_relevantes_proximos": []
        }

        if reverse_geocode_result:
            # Pegamos o primeiro resultado que geralmente é o mais relevante
            first_result = reverse_geocode_result[0]
            address_info["endereco_completo"] = first_result.get('formatted_address')

            # Procurar pontos de interesse próximos (Places API)
            # Você pode especificar 'radius' em metros e 'type' para filtrar
            places_result = gmaps.places_nearby(location=(latitude, longitude),
                                         radius=200)

            for place in places_result.get('results', []):
                address_info["pontos_relevantes_proximos"].append({
                    "nome": place.get('name'),
                    "endereco": place.get('vicinity', place.get('formatted_address')),
                    "rating": place.get('rating'),
                    "aberto_agora": place.get('opening_hours', {}).get('open_now')
                })

        return address_info
    except Exception as e:
        return {"erro": f"Ocorreu um erro: {e}"}
