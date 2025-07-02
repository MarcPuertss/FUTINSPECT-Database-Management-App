
from fastapi import APIRouter, HTTPException
from models.schemas import ClubCreate
from database import get_db_connection, execute_query

router = APIRouter(prefix="/clubs", tags=["clubs"])

@router.get("/")
def get_clubs():
    query = """
    SELECT c.*, e.nom 
    FROM practica.Club c 
    JOIN practica.Equip e ON c.id_club = e.id_equip 
    ORDER BY e.nom
    """
    return execute_query(query, fetch=True)

@router.post("/")
def create_club(club: ClubCreate):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Insertar en Equip
            cur.execute("""
                INSERT INTO practica.Equip (id_equip, nom)
                VALUES (%s, %s)
            """, (club.id_club, club.nom))

            # Insertar en Club
            cur.execute("""
                INSERT INTO practica.Club (id_club, ciutat)
                VALUES (%s, %s)
            """, (club.id_club, club.ciutat))

            conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

    return {"message": "Club creado exitosamente"}

@router.put("/{id_club}")
def update_club(id_club: str, club: ClubCreate):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Verificar que el club existe
            cur.execute("""
                SELECT c.id_club 
                FROM practica.Club c 
                WHERE c.id_club = %s
            """, (id_club,))
            
            if not cur.fetchone():
                raise HTTPException(status_code=404, detail="Club no encontrado")

            
            cur.execute("""
                UPDATE practica.Equip 
                SET nom = %s
                WHERE id_equip = %s
            """, (club.nom, id_club))

          
            cur.execute("""
                UPDATE practica.Club 
                SET ciutat = %s
                WHERE id_club = %s
            """, (club.ciutat, id_club))

            conn.commit()
    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

    return {"message": "Club actualizado exitosamente"}

@router.delete("/{id_club}")
def delete_club(id_club: str):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Verificar que el club existe antes de eliminar
            cur.execute("SELECT COUNT(*) FROM practica.Club WHERE id_club = %s", (id_club,))
            if cur.fetchone()[0] == 0:
                raise HTTPException(status_code=404, detail="Club no encontrado")
            
            # Eliminar de Club primero (tabla hija)
            cur.execute("DELETE FROM practica.Club WHERE id_club = %s", (id_club,))
            # Eliminar de Equip después (tabla padre)
            cur.execute("DELETE FROM practica.Equip WHERE id_equip = %s", (id_club,))
            conn.commit()
    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
    
    return {"message": "Club eliminado exitosamente"}