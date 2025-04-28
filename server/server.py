from flask import Flask, jsonify, request
import pickle
import numpy as np
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load pickled data
top30 = pickle.load(open('top30.pkl', 'rb'))
book = pickle.load(open('Book.pkl', 'rb'))
pt=pickle.load(open('pt.pkl','rb'))
scores=pickle.load(open('scores.pkl','rb'))

@app.route('/')
def home():  
    data = {
        'Book-Title': top30['Book-Title'].tolist(),
        'Book-Author': top30['Book-Author'].tolist(),
        'Votes': top30['Votes'].astype(int).tolist(),  
        'Rating': top30['Avgrating'].tolist(),
        'Image-URL-M': top30['Image-URL-M'].tolist()
    }
    return jsonify(data)

@app.route('/search', methods=['POST'])
def search():
    query = request.json.get('query', '').strip()
 
    result = book[book['Book-Title'] == query]

    result = result.drop_duplicates(subset=['Book-Title'])

    if result.empty:
        print("No books found.")
        return jsonify({'message': 'No books found'}), 404
    else:
        print(f"Found books: {result.shape[0]}")
        return jsonify(result.to_dict(orient='records'))
    
@app.route('/recommend', methods=['POST'])
def recommend():
    query = request.json.get('query', '').strip()
    
 
    if query not in pt.index:
        return jsonify({'message': 'Book not found'}), 404

    try:
        index = np.where(pt.index == query)[0][0]
        dist = sorted(list(enumerate(scores[index])), key=lambda x: x[1], reverse=True)[1:9]

        temp=pd.DataFrame()
        for i in dist:
            temp = pd.concat([temp,book[book['Book-Title'] == pt.index[i[0]]]])

        temp.drop_duplicates(subset=['Book-Title'],inplace=True)
        
        return jsonify(temp.to_dict(orient='records'))
    except Exception as e:
        # Debugging line to print the error
        print(f"An error occurred: {e}")
        return jsonify({'message': 'An error occurred on the server'}), 500

if __name__ == '__main__':
    app.run(port=5000)
