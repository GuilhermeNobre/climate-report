from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from aux_functions import get_coordenates, translate_text, validate_location

app = FastAPI()

origins = [
    '*'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageIn(BaseModel):
    location: str
    source: str

@app.get("/")   
async def root():
    return {"message": "API IS ALIVE"}


@app.post("/coordanates")
async def get_coordanates(info: MessageIn):
    print(info.location)
    print(validate_location(info.location))
    return {"message": info.location,
            "source": info.source,
            "location": get_coordenates(translate_text(info.location)),
            "status": "success"}   