import os
import socket
from dotenv import load_dotenv

load_dotenv()


def get_local_ip():
    """Get local IP address for frontend links."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


class Settings:
    PROJECT_NAME = "My Shop"

    # Security
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day
    ACCESS_CODE_EXPIRE_MINUTES = 30

    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///./dev.db")

    # Frontend (for email links)
    FRONTEND_URL = os.getenv("FRONTEND_URL", f"http://{get_local_ip()}:3000")

    # CORS
    ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", f"http://{get_local_ip()}:3000").split(",")

    # SMTP / Email
    SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
    SMTP_USER = os.getenv("SMTP_USER")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    EMAILS_FROM_EMAIL = os.getenv("EMAILS_FROM_EMAIL", "noreply@churchapp.com")

    # ✅ New fields (fix AttributeError)
    SMTP_STARTTLS = os.getenv("SMTP_STARTTLS", "true").lower() == "true"
    SMTP_SSL = os.getenv("SMTP_SSL", "false").lower() == "true"

    # AI Models
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")
    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "BAAI/bge-base-en-v1.5")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    TOGETHER_MODEL = os.getenv("TOGETHER_MODEL", "meta-llama/Llama-3-8B-Instruct")

    # API Keys
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")

    # Feature Flags
    USE_OPENAI_IF_OLLAMA_FAILS = os.getenv("USE_OPENAI_IF_OLLAMA_FAILS", "true").lower() == "true"
    USE_TOGETHER_IF_OLLAMA_FAILS = os.getenv("USE_TOGETHER_IF_OLLAMA_FAILS", "false").lower() == "true"

    # Storage
    CHROMA_DB_DIR = os.getenv("CHROMA_DB_DIR", "backend/app/chroma_db")

    # -------------------- Uploads --------------------
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")  # folder for uploaded images
    os.makedirs(UPLOAD_DIR, exist_ok=True)


settings = Settings()
