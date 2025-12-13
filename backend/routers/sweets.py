from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from backend import models, schemas, auth

router = APIRouter(
    prefix="/api/sweets",
    tags=["sweets"]
)

@router.post("/", response_model=schemas.Sweet, status_code=status.HTTP_201_CREATED)
def create_sweet(sweet: schemas.SweetCreate, db: Session = Depends(auth.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Basic check, maybe check if user is admin later
    db_sweet = models.Sweet(**sweet.model_dump())
    db.add(db_sweet)
    db.commit()
    db.refresh(db_sweet)
    return db_sweet

@router.get("/", response_model=List[schemas.Sweet])
def read_sweets(skip: int = 0, limit: int = 100, db: Session = Depends(auth.get_db)):
    sweets = db.query(models.Sweet).offset(skip).limit(limit).all()
    return sweets

@router.get("/search", response_model=List[schemas.Sweet])
def search_sweets(q: Optional[str] = None, db: Session = Depends(auth.get_db)):
    if q:
        sweets = db.query(models.Sweet).filter(
            (models.Sweet.name.contains(q)) | (models.Sweet.category.contains(q))
        ).all()
        return sweets
    return []

@router.put("/{sweet_id}", response_model=schemas.Sweet)
def update_sweet(sweet_id: int, sweet: schemas.SweetCreate, db: Session = Depends(auth.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_sweet = db.query(models.Sweet).filter(models.Sweet.id == sweet_id).first()
    if not db_sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")
    
    for key, value in sweet.model_dump().items():
        setattr(db_sweet, key, value)
    
    db.commit()
    db.refresh(db_sweet)
    return db_sweet

@router.delete("/{sweet_id}", status_code=status.HTTP_200_OK)
def delete_sweet(sweet_id: int, db: Session = Depends(auth.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_sweet = db.query(models.Sweet).filter(models.Sweet.id == sweet_id).first()
    if not db_sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")
    
    db.delete(db_sweet)
    db.commit()
    return {"detail": "Sweet deleted"}

@router.post("/{sweet_id}/purchase", status_code=status.HTTP_200_OK)
def purchase_sweet(sweet_id: int, db: Session = Depends(auth.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_sweet = db.query(models.Sweet).filter(models.Sweet.id == sweet_id).first()
    if not db_sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")
    
    if db_sweet.quantity <= 0:
        raise HTTPException(status_code=400, detail="Out of stock")
    
    db_sweet.quantity -= 1
    db.commit()
    db.refresh(db_sweet)
    return {"message": "Purchase successful", "sweet": db_sweet}

@router.post("/{sweet_id}/restock", status_code=status.HTTP_200_OK)
def restock_sweet(sweet_id: int, request: schemas.RestockRequest, db: Session = Depends(auth.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_sweet = db.query(models.Sweet).filter(models.Sweet.id == sweet_id).first()
    if not db_sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")
    
    db_sweet.quantity += request.quantity
    db.commit()
    db.refresh(db_sweet)
    return {"message": "Restock successful", "sweet": db_sweet}
