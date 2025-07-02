from fastapi import APIRouter
import psycopg2
import psycopg2.extras
from database import execute_query
from database import get_db_connection
from models.schemas import PartitCreate
from fastapi import HTTPException
from pydantic import BaseModel
from datetime import date, time, datetime
from typing import Optional

router = APIRouter()

# Modelo Pydantic para validar los datos de entrada
class PartitCreate(BaseModel):
    club_local_id: Optional[int] = None
    club_visitant_id: Optional[int] = None
    nacio_local: Optional[int] = None
    nacio_visitant: Optional[int] = None
    data_partit: date
    hora_partit: str  # Cambio: ahora es string para convertir a int
    jornada: int
    id_competicio: int
    id_estadi: int
    id_fase: Optional[int] = None
    resultat: str = ""  # Nuevo: campo obligatorio

@router.post("/partits")
def create_partit(partit: PartitCreate):
    """
    Crear un nuevo partido
    """
    try:
        if partit.club_local_id and partit.club_visitant_id:
            if partit.club_local_id == partit.club_visitant_id:
                raise HTTPException(
                    status_code=400, 
                    detail="El club local y visitante no pueden ser el mismo"
                )
        
        if partit.nacio_local and partit.nacio_visitant:
            if partit.nacio_local == partit.nacio_visitant:
                raise HTTPException(
                    status_code=400, 
                    detail="La nación local y visitante no pueden ser la misma"
                )

        try:
            if ':' in partit.hora_partit:
                hora_parts = partit.hora_partit.split(':')
                hora_int = int(hora_parts[0]) * 60 + int(hora_parts[1])
            else:
                hora_int = int(partit.hora_partit)
        except ValueError:
            raise HTTPException(status_code=400, detail="Formato de hora inválido")

        get_max_id_query = "SELECT COALESCE(MAX(id_partit), 0) + 1 as next_id FROM practica.Partit"
        max_id_result = execute_query(get_max_id_query, fetch=True)
        next_id = max_id_result[0]['next_id'] if max_id_result else 1

        # Query de inserción
        insert_query = """
            INSERT INTO practica.Partit (
                id_partit, club_local, club_visitant, nacio_local, nacio_visitant,
                data, hora, resultat, rang_partit, id_estadi, id_competicio, id_fase
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        # Parámetros para la inserción
        params = (
            next_id,
            partit.club_local_id,
            partit.club_visitant_id, 
            partit.nacio_local,
            partit.nacio_visitant,
            partit.data_partit,
            hora_int,
            partit.resultat,
            partit.jornada,  # rang_partit corresponde a jornada
            partit.id_estadi,
            partit.id_competicio,
            partit.id_fase
        )
        
        # Ejecutar la inserción
        execute_query(insert_query, params)
        
        # Consultar el partido recién creado con todos sus datos
        get_new_partit_query = """
            SELECT p.id_partit, p.data, p.hora, p.resultat, p.rang_partit,
                   p.club_local, p.club_visitant, p.nacio_local, p.nacio_visitant,
                   p.id_estadi, p.id_competicio, p.id_fase,
                   e.nom as nom_estadi, c.nom as nom_competicio,
                   COALESCE(el.nom, en.nom) as equip_local,
                   COALESCE(ev.nom, en2.nom) as equip_visitant
            FROM practica.Partit p
            LEFT JOIN practica.Estadi e ON p.id_estadi = e.id_estadi
            LEFT JOIN practica.Competicio c ON p.id_competicio = c.id_competicio
            -- JOINs para equipos locales
            LEFT JOIN practica.Club cl ON p.club_local = cl.id_club
            LEFT JOIN practica.Equip el ON cl.id_club = el.id_equip
            LEFT JOIN practica.Nacio nl ON p.nacio_local = nl.id_nacio
            LEFT JOIN practica.Equip en ON nl.id_nacio = en.id_equip
            -- JOINs para equipos visitantes
            LEFT JOIN practica.Club cv ON p.club_visitant = cv.id_club
            LEFT JOIN practica.Equip ev ON cv.id_club = ev.id_equip
            LEFT JOIN practica.Nacio nv ON p.nacio_visitant = nv.id_nacio
            LEFT JOIN practica.Equip en2 ON nv.id_nacio = en2.id_equip
            WHERE p.id_partit = %s
        """
        
        new_partit = execute_query(get_new_partit_query, (next_id,), fetch=True)
        
        return {
            "message": "Partido creado exitosamente",
            "id_partit": next_id,
            "partit": new_partit[0] if new_partit else None
        }
            
    except psycopg2.IntegrityError as e:
        if "foreign key" in str(e).lower():
            raise HTTPException(
                status_code=400, 
                detail="Uno o más de los IDs proporcionados no existen en la base de datos"
            )
        elif "unique" in str(e).lower():
            raise HTTPException(
                status_code=400, 
                detail="Ya existe un partido con estas características"
            )
        else:
            raise HTTPException(status_code=400, detail=f"Error de integridad: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")


# Función auxiliar que necesitas añadir a tu database.py
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

@router.get("/partits")
def get_partits(year: int = None, month: int = None):
    base_query = """
        SELECT p.id_partit, p.data, p.hora, p.resultat, p.rang_partit,
               p.club_local, p.club_visitant, p.nacio_local, p.nacio_visitant,
               p.id_estadi, p.id_competicio, p.id_fase,
               e.nom as nom_estadi, c.nom as nom_competicio,
               COALESCE(el.nom, en.nom) as equip_local,
               COALESCE(ev.nom, en2.nom) as equip_visitant
        FROM practica.Partit p
        LEFT JOIN practica.Estadi e ON p.id_estadi = e.id_estadi
        LEFT JOIN practica.Competicio c ON p.id_competicio = c.id_competicio
        -- JOINs para equipos locales
        LEFT JOIN practica.Club cl ON p.club_local = cl.id_club
        LEFT JOIN practica.Equip el ON cl.id_club = el.id_equip
        LEFT JOIN practica.Nacio nl ON p.nacio_local = nl.id_nacio
        LEFT JOIN practica.Equip en ON nl.id_nacio = en.id_equip
        -- JOINs para equipos visitantes
        LEFT JOIN practica.Club cv ON p.club_visitant = cv.id_club
        LEFT JOIN practica.Equip ev ON cv.id_club = ev.id_equip
        LEFT JOIN practica.Nacio nv ON p.nacio_visitant = nv.id_nacio
        LEFT JOIN practica.Equip en2 ON nv.id_nacio = en2.id_equip
    """
    conditions = []
    if year:
        conditions.append(f"EXTRACT(YEAR FROM p.data) = {year}")
    if month:
        conditions.append(f"EXTRACT(MONTH FROM p.data) = {month}")

    if conditions:
        base_query += " WHERE " + " AND ".join(conditions)

    return execute_query(base_query, fetch=True)

@router.post("/partits")
def create_partit(partit: PartitCreate):
    query = """
    INSERT INTO practica.Partit 
    (id_partit, data, hora, resultat, rang_partit, 
     club_local, club_visitant, nacio_local, nacio_visitant, 
     id_estadi, id_competicio, id_fase)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    params = (
        partit.id_partit, partit.data, partit.hora, partit.resultat, partit.rang_partit,
        partit.club_local, partit.club_visitant, partit.nacio_local, partit.nacio_visitant,
        partit.id_estadi, partit.id_competicio, partit.id_fase
    )
    execute_query(query, params)
    return {"message": "Partido creado exitosamente"}

# Añadir este endpoint al final de partits.py

# Modelo Pydantic para validar los datos de actualización
class PartitUpdate(BaseModel):
    club_local_id: Optional[int] = None
    club_visitant_id: Optional[int] = None
    nacio_local: Optional[int] = None
    nacio_visitant: Optional[int] = None
    data_partit: Optional[date] = None
    hora_partit: Optional[str] = None
    jornada: Optional[int] = None
    id_competicio: Optional[int] = None
    id_estadi: Optional[int] = None
    id_fase: Optional[int] = None
    resultat: Optional[str] = None

@router.put("/partits/{id_partit}")
def update_partit(id_partit: int, partit: PartitUpdate):
    """
    Actualizar un partido existente
    """
    try:
        # Verificar que el partido existe
        check_query = "SELECT id_partit FROM practica.Partit WHERE id_partit = %s"
        existing_partit = execute_query(check_query, (id_partit,), fetch=True)
        
        if not existing_partit:
            raise HTTPException(
                status_code=404, 
                detail="El partido no existe"
            )

        # Validaciones básicas si se proporcionan los campos
        if partit.club_local_id and partit.club_visitant_id:
            if partit.club_local_id == partit.club_visitant_id:
                raise HTTPException(
                    status_code=400, 
                    detail="El club local y visitante no pueden ser el mismo"
                )
        
        if partit.nacio_local and partit.nacio_visitant:
            if partit.nacio_local == partit.nacio_visitant:
                raise HTTPException(
                    status_code=400, 
                    detail="La nación local y visitante no pueden ser la misma"
                )

        # Convertir hora si se proporciona
        hora_int = None
        if partit.hora_partit:
            try:
                if ':' in partit.hora_partit:
                    hora_parts = partit.hora_partit.split(':')
                    hora_int = int(hora_parts[0]) * 60 + int(hora_parts[1])
                else:
                    hora_int = int(partit.hora_partit)
            except ValueError:
                raise HTTPException(status_code=400, detail="Formato de hora inválido")

        # Construir query de actualización dinámicamente
        update_fields = []
        params = []
        
        if partit.club_local_id is not None:
            update_fields.append("club_local = %s")
            params.append(partit.club_local_id)
        
        if partit.club_visitant_id is not None:
            update_fields.append("club_visitant = %s")
            params.append(partit.club_visitant_id)
            
        if partit.nacio_local is not None:
            update_fields.append("nacio_local = %s")
            params.append(partit.nacio_local)
            
        if partit.nacio_visitant is not None:
            update_fields.append("nacio_visitant = %s")
            params.append(partit.nacio_visitant)
            
        if partit.data_partit is not None:
            update_fields.append("data = %s")
            params.append(partit.data_partit)
            
        if hora_int is not None:
            update_fields.append("hora = %s")
            params.append(hora_int)
            
        if partit.jornada is not None:
            update_fields.append("rang_partit = %s")
            params.append(partit.jornada)
            
        if partit.id_competicio is not None:
            update_fields.append("id_competicio = %s")
            params.append(partit.id_competicio)
            
        if partit.id_estadi is not None:
            update_fields.append("id_estadi = %s")
            params.append(partit.id_estadi)
            
        if partit.id_fase is not None:
            update_fields.append("id_fase = %s")
            params.append(partit.id_fase)
            
        if partit.resultat is not None:
            update_fields.append("resultat = %s")
            params.append(partit.resultat)

        if not update_fields:
            raise HTTPException(
                status_code=400, 
                detail="No se proporcionaron campos para actualizar"
            )

        # Ejecutar actualización
        update_query = f"""
            UPDATE practica.Partit 
            SET {', '.join(update_fields)}
            WHERE id_partit = %s
        """
        params.append(id_partit)
        
        execute_query(update_query, tuple(params))
        
        # Consultar el partido actualizado con todos sus datos
        get_updated_partit_query = """
            SELECT p.id_partit, p.data, p.hora, p.resultat, p.rang_partit,
                   p.club_local, p.club_visitant, p.nacio_local, p.nacio_visitant,
                   p.id_estadi, p.id_competicio, p.id_fase,
                   e.nom as nom_estadi, c.nom as nom_competicio,
                   COALESCE(el.nom, en.nom) as equip_local,
                   COALESCE(ev.nom, en2.nom) as equip_visitant
            FROM practica.Partit p
            LEFT JOIN practica.Estadi e ON p.id_estadi = e.id_estadi
            LEFT JOIN practica.Competicio c ON p.id_competicio = c.id_competicio
            -- JOINs para equipos locales
            LEFT JOIN practica.Club cl ON p.club_local = cl.id_club
            LEFT JOIN practica.Equip el ON cl.id_club = el.id_equip
            LEFT JOIN practica.Nacio nl ON p.nacio_local = nl.id_nacio
            LEFT JOIN practica.Equip en ON nl.id_nacio = en.id_equip
            -- JOINs para equipos visitantes
            LEFT JOIN practica.Club cv ON p.club_visitant = cv.id_club
            LEFT JOIN practica.Equip ev ON cv.id_club = ev.id_equip
            LEFT JOIN practica.Nacio nv ON p.nacio_visitant = nv.id_nacio
            LEFT JOIN practica.Equip en2 ON nv.id_nacio = en2.id_equip
            WHERE p.id_partit = %s
        """
        
        updated_partit = execute_query(get_updated_partit_query, (id_partit,), fetch=True)
        
        return {
            "message": "Partido actualizado exitosamente",
            "id_partit": id_partit,
            "partit": updated_partit[0] if updated_partit else None
        }
            
    except psycopg2.IntegrityError as e:
        if "foreign key" in str(e).lower():
            raise HTTPException(
                status_code=400, 
                detail="Uno o más de los IDs proporcionados no existen en la base de datos"
            )
        elif "unique" in str(e).lower():
            raise HTTPException(
                status_code=400, 
                detail="Ya existe un partido con estas características"
            )
        else:
            raise HTTPException(status_code=400, detail=f"Error de integridad: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.get("/partits/{id_partit}")
def get_partit_by_id(id_partit: int):
    """
    Obtener un partido específico por su ID
    """
    query = """
        SELECT p.id_partit, p.data, p.hora, p.resultat, p.rang_partit,
               p.club_local, p.club_visitant, p.nacio_local, p.nacio_visitant,
               p.id_estadi, p.id_competicio, p.id_fase,
               e.nom as nom_estadi, c.nom as nom_competicio,
               COALESCE(el.nom, en.nom) as equip_local,
               COALESCE(ev.nom, en2.nom) as equip_visitant
        FROM practica.Partit p
        LEFT JOIN practica.Estadi e ON p.id_estadi = e.id_estadi
        LEFT JOIN practica.Competicio c ON p.id_competicio = c.id_competicio
        -- JOINs para equipos locales
        LEFT JOIN practica.Club cl ON p.club_local = cl.id_club
        LEFT JOIN practica.Equip el ON cl.id_club = el.id_equip
        LEFT JOIN practica.Nacio nl ON p.nacio_local = nl.id_nacio
        LEFT JOIN practica.Equip en ON nl.id_nacio = en.id_equip
        -- JOINs para equipos visitantes
        LEFT JOIN practica.Club cv ON p.club_visitant = cv.id_club
        LEFT JOIN practica.Equip ev ON cv.id_club = ev.id_equip
        LEFT JOIN practica.Nacio nv ON p.nacio_visitant = nv.id_nacio
        LEFT JOIN practica.Equip en2 ON nv.id_nacio = en2.id_equip
        WHERE p.id_partit = %s
    """
    
    result = execute_query(query, (id_partit,), fetch=True)
    
    if not result:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    
    return result[0]

@router.delete("/partits/{id_partit}")
def delete_partit(id_partit: int):
    """
    Eliminar un partido existente
    """
    try:
        # Verificar que el partido existe antes de intentar eliminarlo
        check_query = """
            SELECT p.id_partit, p.data, p.hora, p.resultat, p.rang_partit,
                   p.club_local, p.club_visitant, p.nacio_local, p.nacio_visitant,
                   p.id_estadi, p.id_competicio, p.id_fase,
                   e.nom as nom_estadi, c.nom as nom_competicio,
                   COALESCE(el.nom, en.nom) as equip_local,
                   COALESCE(ev.nom, en2.nom) as equip_visitant
            FROM practica.Partit p
            LEFT JOIN practica.Estadi e ON p.id_estadi = e.id_estadi
            LEFT JOIN practica.Competicio c ON p.id_competicio = c.id_competicio
            -- JOINs para equipos locales
            LEFT JOIN practica.Club cl ON p.club_local = cl.id_club
            LEFT JOIN practica.Equip el ON cl.id_club = el.id_equip
            LEFT JOIN practica.Nacio nl ON p.nacio_local = nl.id_nacio
            LEFT JOIN practica.Equip en ON nl.id_nacio = en.id_equip
            -- JOINs para equipos visitantes
            LEFT JOIN practica.Club cv ON p.club_visitant = cv.id_club
            LEFT JOIN practica.Equip ev ON cv.id_club = ev.id_equip
            LEFT JOIN practica.Nacio nv ON p.nacio_visitant = nv.id_nacio
            LEFT JOIN practica.Equip en2 ON nv.id_nacio = en2.id_equip
            WHERE p.id_partit = %s
        """
        
        existing_partit = execute_query(check_query, (id_partit,), fetch=True)
        
        if not existing_partit:
            raise HTTPException(
                status_code=404, 
                detail="El partido no existe"
            )
        
        # Guardar la información del partido antes de eliminarlo para la respuesta
        partit_info = existing_partit[0]
        
        # Ejecutar la eliminación
        delete_query = "DELETE FROM practica.Partit WHERE id_partit = %s"
        execute_query(delete_query, (id_partit,))
        
        return {
            "message": "Partido eliminado exitosamente",
            "id_partit": id_partit,
            "partit_eliminado": partit_info
        }
        
    except HTTPException:
        # Re-lanzar las HTTPException ya manejadas
        raise
    except psycopg2.IntegrityError as e:
        # Manejar errores de integridad referencial
        if "foreign key" in str(e).lower():
            raise HTTPException(
                status_code=400, 
                detail="No se puede eliminar el partido porque está siendo referenciado por otros registros"
            )
        else:
            raise HTTPException(status_code=400, detail=f"Error de integridad: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")