import requests
import pandas as pd
from datetime import datetime
import time
import openpyxl
from multiprocessing import Pool, cpu_count

BEARER_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTcyYWVkNzU5YTA4Yzg3NzkzM2FlMzMxYmZjZTNkMiIsIm5iZiI6MTczMTEyMzMwNS43MDUsInN1YiI6IjY3MmVkODY5OWZkZGU4YzRiODhiY2E4NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gWrxgrIbl2zG3D4Xd3Ea_VTPrmW4BW5RRe4tZtu2AKg"
BASE_URL = 'https://api.themoviedb.org/3/movie'
LANGUAGE = 'en'  
TODAY = datetime.today().strftime('%Y-%m-%d')

def fetch_movies(page,genre):
    url = f"https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page={page}&primary_release_date.lte={TODAY}&sort_by=popularity.desc&with_genres={genre}&with_original_language={LANGUAGE}"
    headers = {"accept": "application/json", "Authorization": f"Bearer {BEARER_TOKEN}"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def fetch_movie_details(movie_id):
    headers = {"accept": "application/json", "Authorization": f"Bearer {BEARER_TOKEN}"}
    movie_response = requests.get(f"{BASE_URL}/{movie_id}?language=en-US", headers=headers).json()
    cast_crew_response = requests.get(f"{BASE_URL}/{movie_id}/credits", headers=headers).json()
    keywords_response = requests.get(f"{BASE_URL}/{movie_id}/keywords", headers=headers).json()
    return {
        'ID': movie_id,
        'Name': movie_response.get('title'),
        'Language': LANGUAGE,
        'Overview': movie_response.get('overview'),
        'Release Year': movie_response.get('release_date', '').split('-')[0],
        'Genres': ', '.join([genre['name'] for genre in movie_response.get('genres', [])]),
        'Cast': ', '.join([cast['name'] for cast in cast_crew_response.get('cast', [])[:5]]),
        'Crew': ', '.join([crew['name'] for crew in cast_crew_response.get('crew', []) if crew['job'] == 'Director']),
        'Keywords': ', '.join([keyword['name'] for keyword in keywords_response.get('keywords', [])]),
    }

def save_to_excel(data):
    file_path = "movies_data.xlsx"
    new_df = pd.DataFrame(data)
    try:
        existing_df = pd.read_excel(file_path, engine="openpyxl")
        combined_df = pd.concat([existing_df, new_df], ignore_index=True)
    except FileNotFoundError:
        combined_df = new_df

    with pd.ExcelWriter(file_path, mode="w", engine="openpyxl") as writer:
        combined_df.to_excel(writer, index=False)

def main(start,max,genre):
    movies_data = []
    for page in range(start, max + 1):  # Fetch only 4 pages
        print(f"Fetching page {page}...")
        movies = fetch_movies(page,genre=genre)
        if not movies.get('results'):
            break
        
        movie_ids = [movie['id'] for movie in movies['results']]
        print(f"Fetching details for {len(movie_ids)} movies in parallel...")
        
        with Pool(processes=cpu_count()) as pool:
            results = pool.map(fetch_movie_details, movie_ids)
            movies_data.extend(results)
    
    save_to_excel(movies_data)
    print("Data saved to movies_data.xlsx",genre)

if __name__ == '__main__':
    main(13,25,35)
    main(13,25,28)
    main(13,25,53)
    main(13,25,10749)
    main(13,25,18)
    main(13,25,27)
    main(13,25,878)
    main(13,25,9648)
    main(13,25,12)
    main(13,25,80)
