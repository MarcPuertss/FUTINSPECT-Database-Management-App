# backend/routers/inscripcions.py

from fastapi import APIRouter, HTTPException
from models.schemas import InscripcioCreate
from database import execute_query

router = APIRouter(prefix="/inscripcions", tags=["inscripcions"])

@router.get("/")
def get_inscripcions():
    query = """
    SELECT i.*, p.nom as jugador_nom, e.nom as club_nom 
    FROM practica.Inscripcio i 
    JOIN practica.Persona p ON i.DNI_jugador = p.DNI 
    JOIN practica.Equip e ON i.id_club = e.id_equip 
    ORDER BY i.any_temporada DESC, p.nom
    """
    return execute_query(query, fetch=True)

@router.post("/")
def create_inscripcio(inscripcio: InscripcioCreate):
    query = """
    INSERT INTO practica.Inscripcio (DNI_jugador, any_temporada, id_club) 
    VALUES (%s, %s, %s)
    """
    execute_query(query, (inscripcio.DNI_jugador, inscripcio.any_temporada, inscripcio.id_club))
    return {"message": "Inscripción creada exitosamente"}

@router.delete("/{dni_jugador}/{any_temporada}")
def delete_inscripcio(dni_jugador: str, any_temporada: int):
    query = "DELETE FROM practica.Inscripcio WHERE DNI_jugador = %s AND any_temporada = %s"
    execute_query(query, (dni_jugador, any_temporada))
    return {"message": "Inscripción eliminada exitosamente"}
