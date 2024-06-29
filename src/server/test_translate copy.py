import json

from octoai.client import OctoAI
from octoai.text_gen import ChatMessage

content = "피자 glass 노란색 안녕 바보 laptop"

client = OctoAI(api_key="INSERT_HERE")
completion = client.text_gen.create_chat_completion(
    model="meta-llama-3-8b-instruct",
    messages=[
        ChatMessage(
            role="system",
            content="Translate to English. Provide the English words ONLY in order. Do not say, Here are the English words in order:",
        ),
        ChatMessage(role="user", content=content),
    ],
    max_tokens=150,
)

# print(json.dumps(completion.dict(), indent=2))
# print(completion.dict())
print(completion.choices[0].message.content)