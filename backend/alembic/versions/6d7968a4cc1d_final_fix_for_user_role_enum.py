from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '6d7968a4cc1d'
down_revision: Union[str, Sequence[str], None] = '7e52d4dd4d0c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands manually added ###
    # Step 1: Alter the 'users' table's 'role' column type to TEXT.
    # This is a safe intermediate step to preserve data and remove the dependency on the old ENUM.
    op.execute("ALTER TABLE users ALTER COLUMN role TYPE TEXT")

    # Step 2: Drop the old ENUM type. The column no longer depends on it.
    op.execute("DROP TYPE IF EXISTS role")

    # Step 3: Create the new ENUM type with the correct, lowercase values.
    role_enum = postgresql.ENUM('user', 'admin', name='role')
    role_enum.create(op.get_bind())

    # Step 4: Alter the 'users' table's 'role' column to use the new ENUM type.
    # The `USING` clause correctly casts the `TEXT` data to the new ENUM type.
    op.execute("ALTER TABLE users ALTER COLUMN role TYPE role USING role::role")
    # ### end commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands manually added ###
    # Step 1: Temporarily cast the column to a generic type (VARCHAR)
    op.execute("ALTER TABLE users ALTER COLUMN role TYPE varchar(20) USING role::varchar(20)")

    # Step 2: Drop the enum type
    op.execute("DROP TYPE role")
    # Step 3: Recreate the old enum type. You will need to define the old enum
    # here if the downgrade is to be fully reversible, but this is often not needed.
    # For simplicity, we just leave the column as VARCHAR.
    # ### end commands ###