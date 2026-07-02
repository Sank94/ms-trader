from dataclasses import dataclass
from typing import Optional


@dataclass
class SessionManager:
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    public_token: Optional[str] = None
    user_name: Optional[str] = None
    user_id: Optional[str] = None
    login_time: Optional[str] = None

    def is_authenticated(self) -> bool:
        return self.access_token is not None

    def clear(self):
        self.access_token = None
        self.refresh_token = None
        self.public_token = None
        self.user_name = None
        self.user_id = None
        self.login_time = None


session_manager = SessionManager()