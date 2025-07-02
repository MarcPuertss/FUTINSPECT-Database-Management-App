# backend/routers/arbitres.py
from fastapi import APIRouter, HTTPException
from database import execute_query, get_db_connection
from models.schemas import ArbitreCreate

router = APIRouter(prefix="/arbitres", tags=["arbitres"])

@router.get("/")
def get_arbitres():
    query = """
    SELECT a.*, p.nom, p.data_naixement, p.nacionalitat 
    FROM practica.Arbitre a 
    JOIN practica.Persona p ON a.DNI = p.DNI 
    ORDER BY p.nom
    """
    return execute_query(query, fetch=True)

@router.post("/")
def create_arbitre(arbitre: ArbitreCreate):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO practica.Persona (DNI, nom, data_naixement, nacionalitat) 
                VALUES (%s, %s, %s, %s)
            """, (arbitre.DNI, arbitre.nom, arbitre.data_naixement, arbitre.nacionalitat))
            
            cur.execute("""
                INSERT INTO practica.Arbitre (DNI, rang_arbitre) 
                VALUES (%s, %s)
            """, (arbitre.DNI, arbitre.rang_arbitre))
            
            conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
    
    return {"message": "Árbitro creado exitosamente"}

@router.put("/{dni}")
def update_arbitre(dni: str, arbitre: ArbitreCreate):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE practica.Persona 
                SET nom = %s, data_naixement = %s, nacionalitat = %s 
                WHERE DNI = %s
            """, (arbitre.nom, arbitre.data_naixement, arbitre.nacionalitat, dni))
            
            cur.execute("""
                UPDATE practica.Arbitre 
                SET rang_arbitre = %s 
                WHERE DNI = %s
            """, (arbitre.rang_arbitre, dni))
            

            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Árbitro no encontrado")
            
            conn.commit()
    except Exception as e:
        conn.rollback()
        if "Árbitro no encontrado" in str(e):
            raise e
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
    
    return {"message": "Árbitro actualizado exitosamente"}

@router.delete("/{dni}")
def delete_arbitre(dni: str):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM practica.Arbitre WHERE DNI = %s", (dni,))
            cur.execute("DELETE FROM practica.Persona WHERE DNI = %s", (dni,))
            conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
    
    return {"message": "Árbitro eliminado exitosamente"}
