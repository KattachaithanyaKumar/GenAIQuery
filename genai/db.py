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
        if not conn.is_connected():
            print("⚠️ Connection object exists but not connected.")
            return {"error": "MySQL Connection not available."}

        print(f"✅ Connected: {conn}")

        # Clean markdown if present
        query = query.strip().strip("```sql").strip("```").strip()

        cursor = conn.cursor(dictionary=True)
        cursor.execute(query)
        print(f"Executed SQL: {query}")

        result = []
        response_type = "unknown"

        if cursor.with_rows:  # This checks if the query returned any rows (e.g., SELECT)
            if any(agg in query.lower() for agg in ["avg", "sum", "count", "min", "max"]):
                result = cursor.fetchone()
                response_type = "aggregate"
            else:
                result = cursor.fetchall()
                response_type = "table"
        else:
            conn.commit()
            result = {"status": "success"}
            response_type = "status"

        # ✅ Ensure result is read before closing cursor
        cursor.fetchall() if cursor.with_rows and result is None else None

    except mysql.connector.Error as err:
        print(f"Query Error: {err}")
        result = {"error": str(err)}
        response_type = "error"

    finally:
        print("----------DONE----------")
        try:
            if cursor:
                cursor.close()
        except Exception as e:
            print(f"Cursor close error: {e}")
        try:
            if conn and conn.is_connected():
                conn.close()
        except Exception as e:
            print(f"Connection close error: {e}")

    return {"result": result, "response_type": response_type}
