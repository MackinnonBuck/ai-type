from octoai.client import OctoAI
from octoai.text_gen import ChatCompletionResponseFormat, ChatMessage
from pydantic import BaseModel, Field
from typing import List

api_key = "INSERT_HERE"
client = OctoAI(api_key=api_key)

class Car(BaseModel):
    english: str
    other: str

completion = client.text_gen.create_chat_completion(
    model="mistral-7b-instruct",
    messages=[
        ChatMessage(role="system", content="Split each word and translate to english."),
        ChatMessage(role="user", content="안경 is my favorite 색깔."),
    ],
    max_tokens=512,
    presence_penalty=0,
    temperature=0.1,
    top_p=0.9,
    response_format=ChatCompletionResponseFormat(
        type="json_object",
        schema=Car.model_json_schema(),
    ),
)

print(completion.choices[0].message.content)
