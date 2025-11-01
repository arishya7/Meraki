import aiosqlite
from typing import Optional, Dict, Any
from datetime import datetime
import os

# Database file path
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "users.db")

async def init_db():
    """Initialize the database and create tables if they don't exist"""
    async with aiosqlite.connect(DB_PATH) as db:
        # Enable foreign key constraints
        await db.execute("PRAGMA foreign_keys = ON")
        await db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                nric TEXT UNIQUE NOT NULL,
                allows_tracking INTEGER DEFAULT 0,
                created_at TEXT NOT NULL
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS tokens (
                token TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        await db.commit()

async def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """Get a user by email address"""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM users WHERE email = ?",
            (email,)
        ) as cursor:
            row = await cursor.fetchone()
            if row:
                return {
                    "id": row["id"],
                    "name": row["name"],
                    "email": row["email"],
                    "password_hash": row["password_hash"],
                    "nric": row["nric"],
                    "allows_tracking": bool(row["allows_tracking"]),
                    "created_at": row["created_at"]
                }
    return None

async def get_user_by_nric(nric: str) -> Optional[Dict[str, Any]]:
    """Get a user by NRIC"""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM users WHERE nric = ?",
            (nric,)
        ) as cursor:
            row = await cursor.fetchone()
            if row:
                return {
                    "id": row["id"],
                    "name": row["name"],
                    "email": row["email"],
                    "password_hash": row["password_hash"],
                    "nric": row["nric"],
                    "allows_tracking": bool(row["allows_tracking"]),
                    "created_at": row["created_at"]
                }
    return None

async def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    """Get a user by user ID"""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM users WHERE id = ?",
            (user_id,)
        ) as cursor:
            row = await cursor.fetchone()
            if row:
                return {
                    "id": row["id"],
                    "name": row["name"],
                    "email": row["email"],
                    "password_hash": row["password_hash"],
                    "nric": row["nric"],
                    "allows_tracking": bool(row["allows_tracking"]),
                    "created_at": row["created_at"]
                }
    return None

async def create_user(
    user_id: str,
    name: str,
    email: str,
    password_hash: str,
    nric: str,
    allows_tracking: bool = False
) -> Dict[str, Any]:
    """Create a new user in the database"""
    created_at = datetime.now().isoformat()
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            INSERT INTO users (id, name, email, password_hash, nric, allows_tracking, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_id, name, email, password_hash, nric, 1 if allows_tracking else 0, created_at))
        await db.commit()
    
    return {
        "id": user_id,
        "name": name,
        "email": email,
        "password_hash": password_hash,
        "nric": nric,
        "allows_tracking": allows_tracking,
        "created_at": created_at
    }

async def store_token(token: str, user_id: str):
    """Store a token in the database"""
    created_at = datetime.now().isoformat()
    async with aiosqlite.connect(DB_PATH) as db:
        # Enable foreign key constraints
        await db.execute("PRAGMA foreign_keys = ON")
        await db.execute("""
            INSERT OR REPLACE INTO tokens (token, user_id, created_at)
            VALUES (?, ?, ?)
        """, (token, user_id, created_at))
        await db.commit()

async def get_user_id_from_token(token: str) -> Optional[str]:
    """Get user ID from a token"""
    async with aiosqlite.connect(DB_PATH) as db:
        async with db.execute(
            "SELECT user_id FROM tokens WHERE token = ?",
            (token,)
        ) as cursor:
            row = await cursor.fetchone()
            if row:
                return row[0]
    return None

async def get_all_users() -> list:
    """Get all users from the database (for migration purposes)"""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM users") as cursor:
            rows = await cursor.fetchall()
            return [
                {
                    "id": row["id"],
                    "name": row["name"],
                    "email": row["email"],
                    "password_hash": row["password_hash"],
                    "nric": row["nric"],
                    "allows_tracking": bool(row["allows_tracking"]),
                    "created_at": row["created_at"]
                }
                for row in rows
            ]

async def update_user_tracking_permission(user_id: str, allows_tracking: bool) -> bool:
    """Update user's location tracking permission"""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            UPDATE users
            SET allows_tracking = ?
            WHERE id = ?
        """, (1 if allows_tracking else 0, user_id))
        await db.commit()
        return True

