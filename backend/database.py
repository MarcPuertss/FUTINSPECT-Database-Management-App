import psycopg2
import psycopg2.extras
from fastapi import HTTPException

def get_db_connection():
    return psycopg2.connect(
        dbname="XXXXXXXXX",
        user="XXXXXXXXXX",
        password="XXXXXXXXX",
        host="XXXXXXXXX",
        port="5432",
        options='-c search_path=practica,public'
    )

def execute_query(query: str, params: tuple = (), fetch: bool = False):
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(query, params)
            if fetch:
                return cur.fetchall()
            conn.commit()
            return True
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

def execute_query_with_return(query: str, params: tuple = ()):
    """
    Ejecuta una query que retorna datos (como INSERT con RETURNING)
    """
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(query, params)
            result = cur.fetchall()
            conn.commit()
            return result
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()