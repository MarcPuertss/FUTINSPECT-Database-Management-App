from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import partits, jugadors
from routers import arbitres
from routers import clubs
from routers import estadis
from routers import competicions
from routers import inscripcions
from routers import admin
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Football Management API")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(partits.router)
app.include_router(jugadors.router)
app.include_router(arbitres.router)
app.include_router(clubs.router)
app.include_router(estadis.router)
app.include_router(competicions.router)
app.include_router(inscripcions.router)
app.include_router(admin.router) 

@app.get("/")
def read_root():
    return {"message": "Football Management API modularizada ✅"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


