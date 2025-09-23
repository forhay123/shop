"""Add created_at to reviews

Revision ID: e55457b1266b
Revises: 3c48b07a79a8
Create Date: 2025-09-21 18:03:50.980111

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from datetime import datetime # 🟢 Import datetime

# revision identifiers, used by Alembic.
revision: str = 'e55457b1266b'
down_revision: Union[str, Sequence[str], None] = '3c48b07a79a8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Step 1: Add the column, initially as nullable
    op.add_column('reviews', sa.Column('created_at', sa.DateTime(), nullable=True))

    # Step 2: Populate the new column with a default value for existing rows
    # This is needed because the column must be NOT NULL after this migration.
    # You can choose a suitable timestamp.
    op.execute("UPDATE reviews SET created_at = now() WHERE created_at IS NULL")

    # Step 3: Alter the column to add the NOT NULL constraint
    op.alter_column('reviews', 'created_at', nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('reviews', 'created_at')