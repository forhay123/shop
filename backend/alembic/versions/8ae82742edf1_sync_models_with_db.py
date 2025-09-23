"""sync models with DB

Revision ID: 8ae82742edf1
Revises: 7b025cf2a0a4
Create Date: 2025-09-19 03:19:18.868492
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "8ae82742edf1"
down_revision: Union[str, Sequence[str], None] = "7b025cf2a0a4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add created_at with a temporary server default so existing rows get NOW()
    op.add_column(
        "orders",
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    # Remove the default if you only want Python/SQLAlchemy to handle it
    op.alter_column("orders", "created_at", server_default=None)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("orders", "created_at")
