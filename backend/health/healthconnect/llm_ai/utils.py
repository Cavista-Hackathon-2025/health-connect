from openai import OpenAI
import openai
from django.conf import settings
from ..models.doctor import DoctorsModel
openai.api_key = settings.OPENAI_API_KEY
client = OpenAI()
from pydantic import BaseModel

class MedicalTips(BaseModel):
    daily_health_tip: str
    hydration_tip: str
    mental_health_tip:str
    sleep_tip:str
    stress_management_tip:str
    immune_boosting_tip:str
    healthy_lifestyle_habit:str
    food_and_nutrution:str
    
    
class Doctor(BaseModel):
    full_name: str
    phone:str
    gender:str
    specialization: str
    years_of_experience:str
    consultation_fee:str
    
   
    
class RecommendedDoctor(BaseModel):
    doctors:list[Doctor]


def generate_result_for_patient_diagnosis(diagnosis_result):
        print("diagnosis_result")
       
        PatientPrompt = f"""
        you are a medical professional assistant.
        
        you will be given an ill patient details your task is to generate medical tips for the patient.
        
        here are the example medical tip to generate for the patient
        1. Daily Health Tip
        2. Hydration Tip
        3. Mental Health Tip
        4. Sleep Tip
        5. Stress Management Tip
        6. Immune Boosting Tip
        7. Healthy Lifestyle Habit
        8. Food and nutrution
        
        Use the following step-by-step instructions to generate medical tip for the patient
        
        1. Analyze the patient details and Identify key aspect such as Age,gender,symptoms, medical_history,allergies,current_medication and
        test_result_text
        
        2. use the Analyze patient result you have to generate medical tips
        
        3. Strickly use the patient result provided to you
        
        4. Strickly return professional medical tip tailor to the patient details

        """

        response = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {
            "role": "system",
            "content": PatientPrompt
            },
            {
            "role": "user",
            "content": f"""
            here is diagnosis result of the patient :\n 
            Age: {diagnosis_result.age}\n
            gender: {diagnosis_result.gender}\n
            Symptoms: {diagnosis_result.symptoms}\n
            Medical History: {diagnosis_result.medical_history}\n
            Allergies:{diagnosis_result.allergies}\n
            Current medication: {diagnosis_result.current_medication}\n
            Test result: {diagnosis_result.test_result_text}\n
            """
            }
        ],
        timeout=360,
        response_format=MedicalTips,
        )

        return response.choices[0].message.parsed
    
    
    

def generate_recommended_doctor_for_patient(diagnosis_result):
    available_professional_doctors = DoctorsModel.objects.all()
    doctors_details = ""
    for doctor in available_professional_doctors:
        doctor_data = f"""
        Full Name: {doctor.full_name}
        Specialization: {doctor.specialization}
        Years of Experience: {doctor.years_of_experience}
        Consultation Fee: {doctor.consultation_fee}
        Bio: {doctor.short_Bio}
        phone:{doctor.phone}
        gender:{doctor.gender}
        """
        doctors_details += doctor_data + "\n"
        print("diagnosis_result",diagnosis_result.symptoms)
       
    RecommendationPrompt = f"""
        you are a medical professional recommendation assistant.
        
        you will be given an ill patient details and list of professional doctors your task is to generate 3 professional doctor for the patient.
        
    
        Use the following step-by-step instructions to professional doctor for the patient tip for the patient
        
        1. Analyze the patient details and Identify key aspect such as Age,gender,symptoms, medical_history,allergies,current_medication and
        test_result_text
        
        2. Analyze the doctors details and key aspect such as specialization,years_of_experience,consultation_fee and bio
        
        3. with the patient and doctors analyzed result you have use it to generate a recommended doctor for the patient
        
        3. Strickly use the doctor and patient result provided to you
        
        4. Strickly return  the best professional medical doctor base on your Analysis
        
        5. strickly generate 3 professional doctor for the patient using doctors years_of_experience and specialization

        """

    response = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {
            "role": "system",
            "content": RecommendationPrompt
            },
            {
            "role": "user",
            "content": f"""
            here is diagnosis result of the patient :\n 
            Age: {diagnosis_result.age}\n
            gender: {diagnosis_result.gender}\n
            Symptoms: {diagnosis_result.symptoms}\n
            Medical History: {diagnosis_result.medical_history}\n
            Allergies:{diagnosis_result.allergies}\n
            Current medication: {diagnosis_result.current_medication}\n
            Test result: {diagnosis_result.test_result_text}\n
            `

            here are the doctors details
            doctors:{doctors_details}
            """
            }
        ],
        timeout=360,
        response_format=RecommendedDoctor,
        )

    return response.choices[0].message.parsed