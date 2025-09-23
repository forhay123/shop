"""add category column to products

Revision ID: c737ef87df01
Revises: 4b9c63c15240_recreate_role_enum
Create Date: 2025-09-18 11:38:15.443647
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'c737ef87df01'
down_revision = '4b9c63c15240_recreate_role_enum'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add category column to products table"""
    op.add_column('products', sa.Column('category', sa.String(length=255), nullable=True))


def downgrade() -> None:
    """Remove category column"""
    op.drop_column('products', 'category')
