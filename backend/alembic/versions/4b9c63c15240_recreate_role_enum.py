"""recreate role enum safely"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = '4b9c63c15240_recreate_role_enum'
down_revision = '6d7968a4cc1d'
branch_labels = None
depends_on = None

def upgrade():
    # Step 1: rename old enum temporarily
    op.execute("ALTER TYPE role RENAME TO role_old;")

    # Step 2: create new enum with correct values
    new_role = postgresql.ENUM('user', 'admin', name='role')
    new_role.create(op.get_bind(), checkfirst=True)

    # Step 3: alter column to use new enum, converting old values safely
    op.execute("ALTER TABLE users ALTER COLUMN role TYPE role USING role::text::role;")

    # Step 4: drop the old enum
    op.execute("DROP TYPE role_old;")


def downgrade():
    # Step 1: rename current enum
    op.execute("ALTER TYPE role RENAME TO role_new;")

    # Step 2: recreate old enum
    old_role = postgresql.ENUM('ADMIN', 'CUSTOMER', 'SELLER', name='role')
    old_role.create(op.get_bind(), checkfirst=True)

    # Step 3: convert column back
    op.execute("ALTER TABLE users ALTER COLUMN role TYPE role USING role::text::role;")

    # Step 4: drop the temporary new enum
    op.execute("DROP TYPE role_new;")
