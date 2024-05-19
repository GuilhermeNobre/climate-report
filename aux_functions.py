from geopy import Nominatim
from deep_translator import GoogleTranslator
import spacy

nlp = spacy.load("en_core_web_md")

loc = Nominatim(user_agent="Geopy Library")

def get_coordenates(location):
    location = loc.geocode(location)
    return location.latitude, location.longitude

def translate_text(text):
    return GoogleTranslator(source='auto', target="en").translate(text)

def validate_location(text):
    doc = nlp(text)
    entities = []
    for ent in doc.ents:
        print(ent.text, "|" ,ent.label_)
        entities.append((ent.text, ent.label_))
    return entities