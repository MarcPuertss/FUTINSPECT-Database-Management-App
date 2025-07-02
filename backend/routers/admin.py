from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from fastapi import  HTTPException
from pydantic import BaseModel

router = APIRouter()

class AdminLoginRequest(BaseModel):
    username: str
    password: str
@router.post("/admin")
async def admin_login(credentials: AdminLoginRequest):
    if credentials.username == "admin" and credentials.password == "1234":
        return {"success": True, "message": "Login exitoso"}
    else:
        return {"success": False, "message": "Usuario o contraseña incorrectos"}
