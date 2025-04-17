from pydantic import BaseModel
from typing import Dict, List, Optional


class UserAddressResponse(BaseModel):
    user_id: str
    addresses: List[str]