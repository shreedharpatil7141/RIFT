import os
from openai import OpenAI

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None


def generate_explanation(data):

    fallback = (
        f"{data['gene']} {data['phenotype']} status significantly influences "
        f"the pharmacokinetics and pharmacodynamics of {data['drug']}. "
        f"Clinical recommendation: {data['recommendation']}"
    )

    if client is None:
        return fallback

    try:
        prompt = f"""
Write a concise, clinically formatted pharmacogenomic interpretation 
in the following exact style:

Example format:
"CYP2D6 Poor Metabolizer status significantly influences the pharmacokinetics 
and pharmacodynamics of codeine and tramadol. Clinical recommendation: 
Avoid codeine and tramadol due to insufficient conversion to active metabolites 
(morphine and O-desmethyltramadol, respectively). Use alternative analgesics."

Now generate a similar structured explanation using:

Gene: {data['gene']}
Phenotype: {data['phenotype']}
Drug: {data['drug']}
Risk Level: {data['risk']}
Recommendation: {data['recommendation']}

Requirements:
- 3–5 sentences only
- Professional medical tone
- Mention metabolic mechanism
- Mention active metabolites if applicable
- Clearly state clinical consequence
- End with dosing or alternative recommendation
- No bullet points
- No headings
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a clinical pharmacogenomics specialist following CPIC-style medical writing."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
            max_tokens=450
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print("LLM ERROR:", e)
        return fallback
