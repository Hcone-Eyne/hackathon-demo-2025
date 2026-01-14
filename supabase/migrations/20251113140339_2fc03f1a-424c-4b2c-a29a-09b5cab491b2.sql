-- Create table for DBT verification records
-- This table will store actual Aadhaar-DBT linking status data
CREATE TABLE IF NOT EXISTS public.aadhaar_dbt_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aadhaar_number text NOT NULL UNIQUE,
  full_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('linked', 'seeded', 'not_linked')),
  bank_name text,
  account_number_last4 text,
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add index for faster lookups
CREATE INDEX idx_aadhaar_dbt_records_aadhaar ON public.aadhaar_dbt_records(aadhaar_number);

-- Enable Row Level Security
ALTER TABLE public.aadhaar_dbt_records ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read records (for verification)
CREATE POLICY "Authenticated users can read DBT records"
  ON public.aadhaar_dbt_records
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert/update/delete records
CREATE POLICY "Only admins can modify DBT records"
  ON public.aadhaar_dbt_records
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_aadhaar_dbt_records_updated_at
  BEFORE UPDATE ON public.aadhaar_dbt_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO public.aadhaar_dbt_records (aadhaar_number, full_name, status, bank_name, account_number_last4, message) VALUES
  ('123456789012', 'Rajesh Kumar', 'linked', 'State Bank of India', '4567', 'Your Aadhaar is linked to a DBT-enabled bank account. You can receive government benefits directly.'),
  ('234567890123', 'Priya Sharma', 'seeded', 'HDFC Bank', '8901', 'Your Aadhaar is seeded with your bank account. Please visit your bank to complete the linking process for DBT benefits.'),
  ('345678901234', 'Amit Patel', 'not_linked', NULL, NULL, 'Your Aadhaar is not linked to any bank account. Please visit your nearest bank branch to link your Aadhaar for DBT benefits.'),
  ('456789012345', 'Sunita Reddy', 'linked', 'ICICI Bank', '2345', 'Your Aadhaar is linked to a DBT-enabled bank account. You can receive government benefits directly.'),
  ('567890123456', 'Vijay Singh', 'seeded', 'Axis Bank', '6789', 'Your Aadhaar is seeded with your bank account. Please visit your bank to complete the linking process for DBT benefits.');