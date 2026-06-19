from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class ChatTurn(BaseModel):
    role: str # 'user' or 'assistant'
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatSessionDocument(BaseModel):
    """
    MongoDB schema representation for RAG chat logs and historical conversations.
    Collection: chat_sessions
    """
    session_id: str = Field(..., description="Unique uuid identifying the user chat window session")
    user_id: Optional[int] = Field(None, description="Linked PostgreSQL User ID if logged in")
    city_context: Optional[str] = Field(None, description="Detected city focus for contextual chat prompts")
    turns: List[ChatTurn] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class RasterRawMetadata(BaseModel):
    """
    MongoDB schema representation for full multi-spectral raw band statistics and tags.
    Collection: satellite_raw_meta
    """
    image_id: str = Field(..., description="Corresponds to primary key in PostgreSQL satellite_images table")
    landsat_metadata: Dict[str, Any] = Field(default={}, description="Raw MTL.txt parameter blocks parsed from Landsat")
    band_statistics: Dict[str, Dict[str, float]] = Field(default={}, description="Mean, median, std, min, max per band channel")
    no_data_mask_count: int = 0
    processing_log: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
