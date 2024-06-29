import json

from octoai.client import OctoAI
from octoai.text_gen import ChatMessage

content = "Seattle is a fun place to visit with lots of food."

client = OctoAI(api_key="INSERT_HERE")
completion = client.text_gen.create_chat_completion(
    model="meta-llama-3-8b-instruct",
    messages=[
        ChatMessage(
            role="system",
            content="Reword the sentence maintaining the meaning.",
        ),
        ChatMessage(role="user", content=content),
    ],
    max_tokens=500,
)

# print(json.dumps(completion.dict(), indent=2))
# print(completion.dict())
print(completion.choices[0].message.content)