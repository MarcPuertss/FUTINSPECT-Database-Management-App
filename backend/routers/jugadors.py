from fastapi import APIRouter, HTTPException
from database import get_db_connection, execute_query
from models.schemas import JugadorCreate
from fastapi import Query
import psycopg2.extras

router = APIRouter()

@router.get("/jugadors")
def get_jugadors(name: str = Query(default=None)):
    base_query = """
    SELECT j.*, p.nom, p.data_naixement, p.nacionalitat 
    FROM practica.Jugador j 
    JOIN practica.Persona p ON j.DNI = p.DNI
    """
    params = []
    if name:
        base_query += " WHERE LOWER(p.nom) LIKE %s"
        params.append(f"%{name.lower()}%")

    base_query += " ORDER BY p.nom"
    return execute_query(base_query, tuple(params), fetch=True)

@router.post("/jugadors")
def create_jugador(jugador: JugadorCreate):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO practica.Persona (DNI, nom, data_naixement, nacionalitat)
                VALUES (%s, %s, %s, %s)
            """, (jugador.DNI, jugador.nom, jugador.data_naixement, jugador.nacionalitat))

            cur.execute("""
                INSERT INTO practica.Jugador (DNI, numero_samarreta, posicio)
                VALUES (%s, %s, %s)
            """, (jugador.DNI, jugador.numero_samarreta, jugador.posicio))

            conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

    return {"message": "Jugador creado exitosamente"}

@router.put("/jugadors/{dni}")
def update_jugador(dni: str, jugador: JugadorCreate):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Verificar que el jugador existe
            cur.execute("""
                SELECT COUNT(*) FROM practica.Jugador j 
                JOIN practica.Persona p ON j.DNI = p.DNI 
                WHERE j.DNI = %s
            """, (dni,))
            
            if cur.fetchone()[0] == 0:
                raise HTTPException(status_code=404, detail="Jugador no encontrado")
            
            # ELIMINADA LA VERIFICACIÓN DE NÚMERO DE CAMISETA DUPLICADO
            # Ya no se verifica si el número está en uso por otro jugador
            # porque según los requisitos, los dorsales duplicados están permitidos
            
            # Actualizar datos en la tabla Persona
            cur.execute("""
                UPDATE practica.Persona 
                SET nom = %s, data_naixement = %s, nacionalitat = %s
                WHERE DNI = %s
            """, (jugador.nom, jugador.data_naixement, jugador.nacionalitat, dni))

            # Actualizar datos en la tabla Jugador
            cur.execute("""
                UPDATE practica.Jugador 
                SET numero_samarreta = %s, posicio = %s
                WHERE DNI = %s
            """, (jugador.numero_samarreta, jugador.posicio, dni))

            conn.commit()
            
    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

    return {"message": "Jugador actualizado exitosamente"}

@router.delete("/jugadors/{dni}")
def delete_jugador(dni: str):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Verificar que el jugador existe antes de eliminar
            cur.execute("SELECT COUNT(*) FROM practica.Jugador WHERE DNI = %s", (dni,))
            if cur.fetchone()[0] == 0:
                raise HTTPException(status_code=404, detail="Jugador no encontrado")
            
            cur.execute("DELETE FROM practica.Jugador WHERE DNI = %s", (dni,))
            cur.execute("DELETE FROM practica.Persona WHERE DNI = %s", (dni,))
            conn.commit()
    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

    return {"message": "Jugador eliminado exitosamente"}