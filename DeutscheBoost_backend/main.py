# main.py – FastAPI backend (auth-aware)
# --------------------------------------------------

import os
from fastapi import FastAPI, Request, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
load_dotenv()

import firebase_admin
from firebase_admin import credentials, firestore, auth as fb_auth

try:
    import deepl  # optional, pip install deepl
except ImportError:
    deepl = None

# -------- ENV ----------------------------------------------------------------
FIREBASE_CRED_PATH = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "serviceAccountKey.json")
DEEPL_API_KEY      = os.getenv("DEEPL_API_KEY")      # optional

cred = credentials.Certificate(FIREBASE_CRED_PATH)
firebase_admin.initialize_app(cred)

db = firestore.client()

translator = deepl.Translator(DEEPL_API_KEY) if DEEPL_API_KEY and deepl else None
if not translator:
    print("⚠️  No DEEPL_API_KEY – using dummy translations.")

# -------------------- AUTH DEPENDENCY ----------------------------------------
async def get_current_uid(authorization: str = Header(...)) -> str:
    """Extracts and verifies Firebase ID token from the Authorization header.
    Expected header:  Authorization: Bearer <ID_TOKEN>"""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    id_token = authorization.split()[1]
    try:
        decoded = fb_auth.verify_id_token(id_token)
        return decoded["uid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")

# -------------------- FASTAPI APP -------------------------------------------
app = FastAPI(title="German Learner API with Auth")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # keep open for dev; tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- ENDPOINTS ---------------------------------------------

@app.post("/translate_phrase")
async def translate_phrase(request: Request,
                           uid: str = Depends(get_current_uid)):
    """Translate a phrase and store it under the current user.
    Body: {"phrase": "Guten Abend", "list": "default"} (list optional)"""
    data = await request.json()
    phrase = data.get("phrase", "").strip()
    list_id = data.get("list", "default")

    if not phrase:
        raise HTTPException(status_code=400, detail="phrase field is required")

    # translate via DeepL or dummy
    if translator:
        res = translator.translate_text(phrase, target_lang="EN-US", source_lang="DE")
        translation = res.text
    else:
        translation = f"{phrase}_EN"

    # Firestore path: users/{uid}/translations
    doc_ref = (
        db.collection("users")
          .document(uid)
          .collection("translations")
          .add({
              "phrase": phrase,
              "translation": translation,
              "list": list_id,
          })
    )

    return {
        "id": doc_ref[1].id,
        "phrase": phrase,
        "translation": translation,
        "list": list_id,
    }


@app.get("/translations")
async def get_translations(list: str | None = None,
                           uid: str = Depends(get_current_uid)):
    """Return all translations for the current user.
    Optional query ?list=<listName> filters by deck/list."""
    col = db.collection("users").document(uid).collection("translations")
    if list:
        col = col.where("list", "==", list)
    docs = col.stream()
    return [{"id": d.id, **d.to_dict()} for d in docs]


@app.get("/lists")
async def get_lists(uid: str = Depends(get_current_uid)):
    """Return distinct list names (decks) for the current user."""
    docs = db.collection("users").document(uid).collection("translations").stream()
    lists = sorted({d.to_dict().get("list", "default") for d in docs})
    return {"lists": lists}


@app.delete("/translations/{doc_id}")
async def delete_translation(doc_id: str, uid: str = Depends(get_current_uid)):
    db.collection("users").document(uid).collection("translations").document(doc_id).delete()
    return {"status": "deleted"}

# -----------------------------------------------------------------------------
# uvicorn main:app --host 0.0.0.0 --port 8000
# -----------------------------------------------------------------------------