
from fastapi import APIRouter, HTTPException
from models.schemas import EstadiCreate
from database import get_db_connection, execute_query

router = APIRouter(prefix="/estadis", tags=["estadis"])

@router.get("/")
def get_estadis():
    query = "SELECT * FROM practica.Estadi ORDER BY nom"
    return execute_query(query, fetch=True)

@router.post("/")
def create_estadi(estadi: EstadiCreate):
    query = """
    INSERT INTO practica.Estadi (id_estadi, nom, ciutat, capacitat, _any)
    VALUES (%s, %s, %s, %s, %s)
    """
    execute_query(query, (estadi.id_estadi, estadi.nom, estadi.ciutat, estadi.capacitat, estadi._any))
    return {"message": "Estadio creado exitosamente"}

@router.put("/{id_estadi}")
def update_estadi(id_estadi: str, estadi: EstadiCreate):
    check_query = "SELECT id_estadi FROM practica.Estadi WHERE id_estadi = %s"
    existing = execute_query(check_query, (id_estadi,), fetch=True)
    
    if not existing:
        raise HTTPException(status_code=404, detail="Estadio no encontrado")
    

    query = """
    UPDATE practica.Estadi 
    SET nom = %s, ciutat = %s, capacitat = %s, _any = %s
    WHERE id_estadi = %s
    """
    execute_query(query, (estadi.nom, estadi.ciutat, estadi.capacitat, estadi._any, id_estadi))
    return {"message": "Estadio actualizado exitosamente"}

@router.delete("/{id_estadi}")
def delete_estadi(id_estadi: str):
    # Verificar si el estadio existe
    check_query = "SELECT id_estadi FROM practica.Estadi WHERE id_estadi = %s"
    existing = execute_query(check_query, (id_estadi,), fetch=True)
    
    if not existing:
        raise HTTPException(status_code=404, detail="Estadio no encontrado")
    
    # Eliminar el estadio
    query = "DELETE FROM practica.Estadi WHERE id_estadi = %s"
    execute_query(query, (id_estadi,))
    return {"message": "Estadio eliminado exitosamente"}