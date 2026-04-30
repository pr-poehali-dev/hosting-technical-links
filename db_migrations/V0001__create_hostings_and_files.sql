CREATE TABLE IF NOT EXISTS hostings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain_ru TEXT NOT NULL UNIQUE,
    tech_url TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hosting_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hosting_id UUID NOT NULL REFERENCES hostings(id),
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    content_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    s3_key TEXT NOT NULL,
    cdn_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hosting_files_hosting_id ON hosting_files(hosting_id);
