import json
import requests

API_KEY = "ecf5db96534148848a0a970a030896a7"
URL = "https://api.rawg.io/api/games" 


TARGET_GAME_COUNT = 1500
MIN_REVIEWS = 1200
MAX_PAGES = 100

params = {
    'key': API_KEY,
    'page_size': 20
}

games = []

for page in range(1, 100):
    params['page'] = page
    response = requests.get(URL, params=params)
    print(f"Page {page} status: {response.status_code}")
    if response.status_code != 200:
        print(response.text)
        break
    data = response.json()
    for g in data['results']:
        reviews = g.get('ratings_count', 0)
        if reviews >= MIN_REVIEWS:
            games.append({
                'title': g['name'],
                'description': g.get('description_raw', ''),
                'releasedate': g.get('released', ''),
                'genres': [genre['name'] for genre in g['genres']],
                'images': [g['background_image']] if g.get('background_image') else []
            })

with open('games.json', 'w', encoding='utf-8') as f:
    json.dump(games, f, ensure_ascii=False, indent=2)