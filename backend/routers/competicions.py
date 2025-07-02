
from fastapi import APIRouter, HTTPException
from models.schemas import CompeticioCreate
from database import execute_query

router = APIRouter(prefix="/competicions", tags=["competicions"])

@router.get("/")
def get_competicions():
    query = """
    SELECT c.*, p.nom as organitzador_nom 
    FROM practica.Competicio c 
    JOIN practica.Persona p ON c.DNI_organitzador = p.DNI 
    ORDER BY c.nom
    """
    return execute_query(query, fetch=True)

@router.post("/")
def create_competicio(competicio: CompeticioCreate):
    query = """
    INSERT INTO practica.Competicio (id_competicio, DNI_organitzador, nom, _any)
    VALUES (%s, %s, %s, %s)
    """
    execute_query(query, (competicio.id_competicio, competicio.DNI_organitzador, competicio.nom, competicio._any))
    return {"message": "Competición creada exitosamente"}
