from flask import Flask, redirect, request, url_for, send_from_directory

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
    return f'The value you supplied is {text}'

if __name__ == '__main__':
    app.run()
