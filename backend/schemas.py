from pydantic import BaseModel, ConfigDict

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class SweetBase(BaseModel):
    name: str
    category: str
    price: float
    quantity: int

class SweetCreate(SweetBase):
    pass

class SweetUpdate(SweetBase):
    pass

class RestockRequest(BaseModel):
    quantity: int

class Sweet(SweetBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
