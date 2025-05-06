from fastapi import FastAPI, Request
from genai import get_sql_query
from db import execute_sql
import os
import logging
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"], 
    allow_headers=["*"],  
)


# Schema description for SQL generation
schema_description = open("schema.txt").read()  # Simple for now

@app.post("/query")
async def query_handler(request: Request):
    print("🔔 /query endpoint hit")
    data = await request.json()

    user_input = data.get("query")
    logger.debug(f"User query: {user_input}")

    # Generate SQL query using OpenAI model
    sql = get_sql_query(user_input, schema_description)
    logger.debug(f"Generated SQL query: {sql}")

    # Execute the SQL query
    result = execute_sql(sql)
    logger.debug(f"Database result: {result}")

    return {"sql": sql, "result": result} 

@app.get("/table")
async def get_table_data():
    logger.debug(f"Fetching data from table")
    table_name = "EMPLOYEES"
    query = f"SELECT * FROM {table_name}"
    result = execute_sql(query)

    return {"table": table_name, "data": result}
