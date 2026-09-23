-- Definisi Enumerasi
CREATE TYPE user_role AS ENUM ('staff', 'spv', 'marcom', 'admin');
CREATE TYPE bs_status AS ENUM ('pending_spv', 'pending_marcom', 'in_progress', 'approved', 'rejected', 'resolved');

-- Tabel Master Toko
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    store_code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Pengguna
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    store_id INT REFERENCES stores(id),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    full_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true
);

-- Tabel Master Produk (Cermin dari ERP)
CREATE TABLE products (
    sku VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    unit VARCHAR(20)
);

-- Tabel Utama Laporan BS
CREATE TABLE bs_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id INT REFERENCES users(id),
    store_id INT REFERENCES stores(id),
    sku VARCHAR(50) REFERENCES products(sku),
    quantity DECIMAL(10,2) NOT NULL,
    damage_type VARCHAR(50),
    found_at DATE NOT NULL,
    notes VARCHAR(200),
    current_status bs_status DEFAULT 'pending_spv',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Foto Bukti
CREATE TABLE bs_photos (
    id SERIAL PRIMARY KEY,
    report_id UUID REFERENCES bs_reports(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Audit Logs & Timeline
CREATE TABLE bs_audit_logs (
    id SERIAL PRIMARY KEY,
    report_id UUID REFERENCES bs_reports(id),
    actor_id INT REFERENCES users(id),
    action_status bs_status,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexing untuk Performa
CREATE INDEX idx_bs_status ON bs_reports(current_status);
CREATE INDEX idx_bs_store ON bs_reports(store_id);
CREATE INDEX idx_bs_sku ON bs_reports(sku);
