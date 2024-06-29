from flask import Flask, redirect, request, url_for, send_from_directory
import json
from octoai.client import OctoAI
from octoai.text_gen import ChatMessage, ChatCompletionResponseFormat
from pydantic import BaseModel, Field
import dotenv
import os

api_key = os.getenv("API_KEY")
app = Flask(__name__)

# Test endpoint
@app.route('/helloworld')
def hello_world():
    return 'Hello, world!'

# Playground endpoints
@app.route('/')
def root():
    return redirect(url_for('playground_home'))

@app.route('/playground')
def playground_home():
    return send_from_directory('../client', 'index.html')

@app.route('/playground/<path:path>')
def playground_file(path):
    return send_from_directory('../client', path)

# API endpoints
@app.route('/api/autocomplete', methods=['POST'])
def autocomplete():
    content = request.json
    text = content['text']
    
    client = OctoAI(api_key=api_key)
    completion = client.text_gen.create_chat_completion(
        model="meta-llama-3-8b-instruct",
        messages=[
            ChatMessage(
                role="system",
                content="Complete the sentence. Provide only the missing parts of the sentence.",
            ),
            ChatMessage(role="user", content=text),
        ],
        max_tokens=150,
    )

    return completion.choices[0].message.content

@app.route('/api/translate', methods=['POST'])
def translate():
    content = request.json
    text = content['text']

    client = OctoAI(api_key=api_key)
    
    class Word(BaseModel):
        original: str
        english: str
    
    completion = client.text_gen.create_chat_completion(
        model="meta-llama-3-8b-instruct",
        messages=[
            ChatMessage(
                role="system",
                content="Include each original non-English word and provide its English translation in order.",
            ),
            ChatMessage(role="user", content=text),
        ],
        max_tokens=150,
        response_format=ChatCompletionResponseFormat(
            type="json_object",
            schema=Word.model_json_schema(),
        ),
    )
    answer = completion.choices[0].message.content
    return answer

if __name__ == '__main__':
    app.run()
