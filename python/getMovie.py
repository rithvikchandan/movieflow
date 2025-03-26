from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import pickle
import joblib
from sklearn.metrics.pairwise import cosine_similarity
import warnings
warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app) 

features_matrix = np.load("features_matrix.npy")
movies_encoded = pd.read_csv("movies_encoded.csv")
encoder = joblib.load("encoder.joblib")
mlb = joblib.load("mlb.joblib")
mlb2 = joblib.load("mlb2.joblib")
mlb3 = joblib.load("mlb3.joblib")
mlb4 = joblib.load("mlb4.joblib")
tf = joblib.load("tf.joblib")

def embed(resp):
     d1=encoder.transform([[resp["release_date"][0:4]]])
     genres = [item["name"] for item in resp["genres"]]
     d2=mlb.transform([genres])
     cast = [item["name"] for item in resp["credits"]["cast"]]
     d3=mlb2.transform([cast])
     crew = [item["name"] for item in resp["credits"]["crew"] if item['job']=='Director']
     d4=mlb3.transform([crew])
     keyword = [item["name"] for item in resp["keywords"]["keywords"]]
     d5=mlb4.transform([keyword])
     d6=tf.transform([resp["overview"]])

     embedding = np.concatenate((d1,d2,d3,d4,d5,d6.todense()),axis=1)
     return embedding

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def recommend_combined_movies(input_movies, priorities=None, top_n=6):
    if priorities is None:
        priorities = [1] * len(input_movies)
    if len(input_movies)==0:
        return []
    input_movie_embeddings = np.asarray(np.vstack([embed(movie) for movie in input_movies]))
    similarity_scores = cosine_similarity(input_movie_embeddings, features_matrix)

    weighted_similarity = (similarity_scores.T * np.array(priorities)).T
    aggregated_similarity = weighted_similarity.sum(axis=0)

    input_movie_indices = []
    for movie in input_movies:
        movie_name = movie['title']
        if movie_name in movies_encoded['Name'].values:
            input_movie_indices.append(movies_encoded[movies_encoded['Name'] == movie_name].index[0])
        else:
            print(f"Warning: '{movie}' not found in movies_encoded")

    aggregated_similarity[input_movie_indices] = -np.inf

    similar_movie_indices = aggregated_similarity.argsort()[-top_n-1:-1][::-1]
    recommended_movies = movies_encoded['Name'].iloc[similar_movie_indices].tolist()

    return recommended_movies



@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    input_movies = data.get("movies", [])
    priorities = data.get("priorities", [1] * len(input_movies))

    if not input_movies:
        return jsonify({"error": "No movies provided"}), 400

    recommendations = recommend_combined_movies(input_movies, priorities)
    return jsonify({"recommendations": recommendations})

if __name__ == '__main__':
    app.run(debug=True)
