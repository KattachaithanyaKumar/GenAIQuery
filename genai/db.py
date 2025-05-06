import time
import mysql.connector
from mysql.connector import Error

import mysql.connector
from mysql.connector import Error

def execute_sql(query):
    print("========SQL=========")
    print(query)
    try:
        print("Attempting connection...")
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="genai"
        )
        if conn.is_connected():
            print(f"✅ Connected: {conn}")
        else:
            print("⚠️ Connection object exists but not connected.")
            return {"error": "MySQL Connection not available."}

        # Clean query if it contains markdown formatting
        query = query.strip().strip("```sql").strip("```").strip()

        cursor = conn.cursor(dictionary=True)
        cursor.execute(query)
        print(f"Executed SQL: {query}")

        if query.lower().startswith("select"):
            result = cursor.fetchall()
        else:
            conn.commit()
            result = {"status": "success"}

    except mysql.connector.Error as err:
        print(f"Query Error: {err}")
        result = {"error": str(err)}

    finally:
        print("----------DONE----------")
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals() and conn.is_connected():
            conn.close()

    return result
