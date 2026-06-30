from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Falcon Trading Terminal"
    APP_VERSION: str = "0.1.0"

    MSTOCK_API_KEY: str
    MSTOCK_USERNAME: str
    MSTOCK_PASSWORD: str
    REDIRECT_URI: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()