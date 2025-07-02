from pydantic import BaseModel
from datetime import date
from typing import Optional

class PartitCreate(BaseModel):
    id_partit: int
    data: date
    hora: int
    resultat: str
    rang_partit: int
    club_local: Optional[int] = None
    club_visitant: Optional[int] = None
    nacio_local: Optional[int] = None
    nacio_visitant: Optional[int] = None
    id_estadi: int
    id_competicio: int
    id_fase: Optional[int] = None



class JugadorCreate(BaseModel):
    DNI: str
    nom: str
    data_naixement: date
    nacionalitat: str
    numero_samarreta: int
    posicio: str

class ArbitreCreate(BaseModel):
    DNI: str
    nom: str
    data_naixement: date
    nacionalitat: str
    rang_arbitre: int


class ClubCreate(BaseModel):
    id_club: int
    nom: str
    ciutat: str

class EstadiCreate(BaseModel):
    id_estadi: int
    nom: str
    ciutat: str
    capacitat: Optional[int] = None
    _any: Optional[int] = None

class CompeticioCreate(BaseModel):
    id_competicio: int
    DNI_organitzador: str
    nom: str
    _any: int


class InscripcioCreate(BaseModel):
    DNI_jugador: str
    any_temporada: int
    id_club: int
