from openai import OpenAI
import openai
from django.conf import settings

openai.api_key = settings.OPENAI_API_KEY
client = OpenAI()


def generate_result_for_patient_diagnosis(diagnosis_result,doctors_details):
        print("diagnosis_result",diagnosis_result)
        print("doctors_details",doctors_details)
        PatientPrompt = f"""
       
    
        """

        response = client.chat.completions.create(
        model="gpt-4o-2024-08-06",
        messages=[
            {
            "role": "system",
            "content": PatientPrompt
            },
            {
            "role": "user",
            "content": f"""
            here is diagnosis result :\n {diagnosis_result}\n and the avaliable professional doctor details {doctors_details}
            
            """
            }
        ],
        timeout=360
        )

        return response.choices[0].message.content