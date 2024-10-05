from typing import Optional

from pydantic import BaseModel


class QueryParamsDTO(BaseModel):
    sort: Optional[str] = "asc"
    by: Optional[str] = "level"