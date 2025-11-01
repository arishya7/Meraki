import os
import asyncpg
from typing import List, Optional
from datetime import date
from Backend.schemas import ClaimData

class ClaimsDBClient:
    """Client for interacting with the claims PostgreSQL database."""

    def __init__(self):
        self.host = os.getenv("DB_HOST", "hackathon-db.ceqjfmi6jhdd.ap-southeast-1.rds.amazonaws.com")
        self.port = os.getenv("DB_PORT", "5432")
        self.database = os.getenv("DB_DATABASE", "hackathon_db")
        self.user = os.getenv("DB_USER", "hackathon_user")
        self.password = os.getenv("DB_PASSWORD", "Hackathon2025!")
        self.dsn = f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}"
        self.pool = None

    async def connect(self):
        """Establishes a connection pool to the database."""
        if not self.pool:
            print(f"[ClaimsDBClient] Creating connection pool for {self.database}...")
            self.pool = await asyncpg.create_pool(dsn=self.dsn)
            print(f"[ClaimsDBClient] Connection pool created.")

    async def disconnect(self):
        """Closes the database connection pool."""
        if self.pool:
            print(f"[ClaimsDBClient] Closing connection pool for {self.database}...")
            await self.pool.close()
            self.pool = None
            print(f"[ClaimsDBClient] Connection pool closed.")

    async def get_all_claims(self) -> List[ClaimData]:
        """Fetches all claims data from the database."""
        if not self.pool:
            await self.connect()
        
        claims: List[ClaimData] = []
        query = """
            SELECT
                claim_number, product_category, product_name, claim_status,
                accident_date, report_date, closed_date, destination,
                claim_type, cause_of_loss, loss_type,
                gross_incurred, gross_paid, gross_reserve,
                net_incurred, net_paid, net_reserve
            FROM
                hackathon.claims
        """
        try:
            async with self.pool.acquire() as connection:
                rows = await connection.fetch(query)
                for row in rows:
                    claim_data = ClaimData(
                        claim_number=row["claim_number"],
                        product_category=row["product_category"],
                        product_name=row["product_name"],
                        claim_status=row["claim_status"],
                        accident_date=row["accident_date"],
                        report_date=row["report_date"],
                        closed_date=row["closed_date"], # Can be None
                        destination=row["destination"],
                        claim_type=row["claim_type"],
                        cause_of_loss=row["cause_of_loss"],
                        loss_type=row["loss_type"],
                        gross_incurred=float(row["gross_incurred"]) if row["gross_incurred"] is not None else 0.0,
                        gross_paid=float(row["gross_paid"]) if row["gross_paid"] is not None else 0.0,
                        gross_reserve=float(row["gross_reserve"]) if row["gross_reserve"] is not None else 0.0,
                        net_incurred=float(row["net_incurred"]) if row["net_incurred"] is not None else 0.0,
                        net_paid=float(row["net_paid"]) if row["net_paid"] is not None else 0.0,
                        net_reserve=float(row["net_reserve"]) if row["net_reserve"] is not None else 0.0
                    )
                    claims.append(claim_data)
        except Exception as e:
            print(f"[ClaimsDBClient] Error fetching all claims: {e}")
        return claims
