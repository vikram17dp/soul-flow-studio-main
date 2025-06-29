
-- Add more fields to packages table for flexible pricing structure
ALTER TABLE public.packages 
ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS original_price NUMERIC,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR',
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'standard';

-- Update existing packages to have INR currency
UPDATE public.packages SET currency = 'INR' WHERE currency IS NULL;
