import openai
import os
from dotenv import load_dotenv
from openai import OpenAI
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def get_sql_query(user_input, schema_description):
    prompt = f"""
You are a SQL expert. Based on this schema:

{schema_description}

if some information is not given try to give some placeholder values not like (employee1, employee2, etc) make sure to give proper names in all the values
if you are fetching some records make sure to fetch all the columns and never fetch with some columns missing expect when asked specifically.

Convert the following natural language request to SQL:

"{user_input}"

Return ONLY the SQL query.
"""

    logger.debug(f"Schema used: {schema_description[:100]}...")  # Log first 100 characters of schema (to prevent too long logs)
    logger.debug(f"User input: {user_input}")

    # Create a client instance
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # Use the Responses API to generate the SQL query
    response = client.responses.create(
        model="gpt-4o",  
        instructions="You are a SQL expert. Please write the SQL query based on the schema and user input.",
        input=prompt,  
    )
    
    generated_sql = response.output_text.strip()
    logger.debug(f"Generated SQL query: {generated_sql}")

    return generated_sql