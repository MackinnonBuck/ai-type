import json
from octoai.client import OctoAI
from octoai.text_gen import ChatMessage

api_key = "INSERT_HERE"

content = "피자 glass 노란색 안녕 바보 laptop"

def translate_to_eng(content):
    client = OctoAI(api_key=api_key)
    completion = client.text_gen.create_chat_completion(
        model="meta-llama-3-8b-instruct",
        messages=[
            ChatMessage(
                role="system",
                content="Find all non-English words in python list.",
            ),
            ChatMessage(role="user", content=content),
        ],
        max_tokens=150,
    )
    answer = completion.choices[0].message.content
    return answer

print(translate_to_eng(content))

# original_words = translate_to_eng(content)[0].split()
# translated_words = translate_to_eng(content)[1].split()

# if len(original_words) != len(translated_words):
#     print('Words do not match')
# else:
#     result = {}
#     for (original, translated) in zip(original_words, translated_words):
#         if original != translated:
#             result[original] = translated

# print(original_words, translated_words)
