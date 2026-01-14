-- Security Fix: Implement hash-based Aadhaar storage
-- This protects PII by storing only hashed values for lookups

-- Enable pgcrypto extension in extensions schema (required for digest function)
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Add hash columns to both tables
ALTER TABLE aadhaar_dbt_records ADD COLUMN IF NOT EXISTS aadhaar_hash text;
ALTER TABLE dbt_checks ADD COLUMN IF NOT EXISTS aadhaar_hash text;

-- Add last 4 digits column to dbt_checks for display purposes
ALTER TABLE dbt_checks ADD COLUMN IF NOT EXISTS aadhaar_last4 text;

-- Create function to hash Aadhaar numbers consistently using extensions.digest
CREATE OR REPLACE FUNCTION hash_aadhaar_number(aadhaar text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT encode(extensions.digest(aadhaar::bytea, 'sha256'), 'hex')
$$;

-- Create trigger function to auto-hash Aadhaar on insert/update for aadhaar_dbt_records
CREATE OR REPLACE FUNCTION hash_aadhaar_dbt_records()
RETURNS TRIGGER AS $$
BEGIN
  NEW.aadhaar_hash := encode(extensions.digest(NEW.aadhaar_number::bytea, 'sha256'), 'hex');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for aadhaar_dbt_records
DROP TRIGGER IF EXISTS hash_aadhaar_before_insert_update ON aadhaar_dbt_records;
CREATE TRIGGER hash_aadhaar_before_insert_update
BEFORE INSERT OR UPDATE ON aadhaar_dbt_records
FOR EACH ROW EXECUTE FUNCTION hash_aadhaar_dbt_records();

-- Create trigger function for dbt_checks to hash and store only last 4 digits
CREATE OR REPLACE FUNCTION hash_aadhaar_dbt_checks()
RETURNS TRIGGER AS $$
BEGIN
  NEW.aadhaar_hash := encode(extensions.digest(NEW.aadhaar_number::bytea, 'sha256'), 'hex');
  -- Store only last 4 digits for display, clear full number
  NEW.aadhaar_last4 := RIGHT(NEW.aadhaar_number, 4);
  -- Clear the plain text Aadhaar (set to masked value)
  NEW.aadhaar_number := 'XXXX-XXXX-' || RIGHT(NEW.aadhaar_number, 4);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for dbt_checks
DROP TRIGGER IF EXISTS hash_aadhaar_before_insert_dbt_checks ON dbt_checks;
CREATE TRIGGER hash_aadhaar_before_insert_dbt_checks
BEFORE INSERT ON dbt_checks
FOR EACH ROW EXECUTE FUNCTION hash_aadhaar_dbt_checks();

-- Update existing records in aadhaar_dbt_records with hashes
UPDATE aadhaar_dbt_records 
SET aadhaar_hash = encode(extensions.digest(aadhaar_number::bytea, 'sha256'), 'hex')
WHERE aadhaar_hash IS NULL;

-- Update existing records in dbt_checks with hashes and mask numbers
UPDATE dbt_checks 
SET 
  aadhaar_hash = encode(extensions.digest(aadhaar_number::bytea, 'sha256'), 'hex'),
  aadhaar_last4 = RIGHT(aadhaar_number, 4),
  aadhaar_number = 'XXXX-XXXX-' || RIGHT(aadhaar_number, 4)
WHERE aadhaar_hash IS NULL AND aadhaar_number NOT LIKE 'XXXX-XXXX-%';

-- Create index on hash column for fast lookups
CREATE INDEX IF NOT EXISTS idx_aadhaar_dbt_records_hash ON aadhaar_dbt_records(aadhaar_hash);
CREATE INDEX IF NOT EXISTS idx_dbt_checks_hash ON dbt_checks(aadhaar_hash);