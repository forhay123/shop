from enum import Enum


class Role(str, Enum):
    ADMIN = "admin"
    READ_ADMIN = "read_admin"
    USER = "user"
