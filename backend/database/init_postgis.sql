-- ==========================================
-- THERMOS AI - DATABASE ARCHITECTURE (POSTGRESQL + POSTGIS)
-- ==========================================

-- Enable PostGIS extension for spatial querying and indexing
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user', -- 'admin', 'user', 'analyst'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Cities Table
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    country VARCHAR(100) NOT NULL,
    coordinates GEOMETRY(Point, 4326), -- PostGIS Point geometry (Lon, Lat)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cities_coordinates ON cities USING GIST (coordinates);

-- 3. Satellite Images Metadata Table
CREATE TABLE IF NOT EXISTS satellite_images (
    id VARCHAR(100) PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    sensor_type VARCHAR(50), -- 'Landsat 8', 'Sentinel 2', 'MODIS'
    cloud_cover_percentage NUMERIC(5, 2),
    bounds GEOMETRY(Polygon, 4326), -- PostGIS bounding box polygon
    resolution_meters INTEGER,
    temperature_min NUMERIC(5, 2),
    temperature_max NUMERIC(5, 2),
    temperature_mean NUMERIC(5, 2),
    hotspot_percentage NUMERIC(5, 2),
    severity_score NUMERIC(4, 2),
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_satellite_bounds ON satellite_images USING GIST (bounds);

-- 4. Environmental Metrics Table
CREATE TABLE IF NOT EXISTS environmental_metrics (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
    aqi INTEGER,
    pollution_index NUMERIC(5, 2),
    green_cover_percentage NUMERIC(5, 2),
    population_density NUMERIC(10, 2),
    building_density NUMERIC(5, 2),
    concrete_area_percentage NUMERIC(5, 2),
    road_density NUMERIC(5, 2),
    humidity NUMERIC(5, 2),
    rainfall NUMERIC(6, 2),
    wind_speed NUMERIC(5, 2),
    recorded_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(city_id, recorded_date)
);

-- 5. Predictions Cache
CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
    model_name VARCHAR(100) NOT NULL, -- 'Prophet', 'XGBoost'
    prediction_horizon VARCHAR(10) NOT NULL, -- '7d', '30d', '6m', '1y'
    predicted_temperature NUMERIC(5, 2) NOT NULL,
    target_date DATE NOT NULL,
    confidence_upper NUMERIC(5, 2),
    confidence_lower NUMERIC(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Heat Zones (Spatial Segments)
CREATE TABLE IF NOT EXISTS heat_zones (
    id SERIAL PRIMARY KEY,
    satellite_image_id VARCHAR(100) REFERENCES satellite_images(id) ON DELETE CASCADE,
    boundary GEOMETRY(Polygon, 4326) NOT NULL, -- PostGIS Polygon of the specific hot zone
    mean_temp NUMERIC(5, 2),
    severity_index NUMERIC(4, 2), -- 1.0 to 10.0
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_heat_zones_boundary ON heat_zones USING GIST (boundary);

-- 7. Recommendations Log Table
CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
    intervention_type VARCHAR(100) NOT NULL, -- 'tree_canopy', 'cool_roofs', etc.
    target_increase_percent NUMERIC(5, 2),
    estimated_temp_reduction NUMERIC(5, 2),
    estimated_cost_usd NUMERIC(12, 2),
    feasibility_score INTEGER,
    priority_level VARCHAR(20), -- 'HIGH', 'MEDIUM', 'LOW'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Simulations Log Table
CREATE TABLE IF NOT EXISTS simulations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    city_name VARCHAR(255) NOT NULL,
    base_temperature NUMERIC(5, 2),
    green_cover_delta NUMERIC(5, 2),
    water_bodies_delta NUMERIC(5, 2),
    reflective_roofs_delta NUMERIC(5, 2),
    concrete_reduction_delta NUMERIC(5, 2),
    simulated_cooling NUMERIC(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Model Registry & Training Runs (MLOps metadata)
CREATE TABLE IF NOT EXISTS model_registry (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) UNIQUE NOT NULL,
    current_version VARCHAR(50) NOT NULL,
    stage VARCHAR(50) DEFAULT 'Staging', -- 'Production', 'Staging', 'Archived'
    framework VARCHAR(100), -- 'PyTorch', 'XGBoost', 'Prophet'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS training_runs (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    run_id VARCHAR(100) UNIQUE NOT NULL, -- MLflow/DVC run uuid
    rmse NUMERIC(6, 4),
    mae NUMERIC(6, 4),
    r2 NUMERIC(5, 4),
    parameters JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Audit and Operations Logs
CREATE TABLE IF NOT EXISTS api_logs (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    user_id INTEGER,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    action_performed VARCHAR(255) NOT NULL,
    target_table VARCHAR(100),
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- SEED DATA SETUP
-- ==========================================
-- Insert default Admin and User accounts (passwords hashed using bcrypt)
INSERT INTO users (email, hashed_password, role, full_name) 
VALUES 
('admin@thermos.ai', '$2b$12$R.R8k6dC6zDpxr857wV0GuklH6p.6vQ6/Z2nOsw2Hox29gLz/D45y', 'admin', 'Administrator'),
('cityplan@thermos.ai', '$2b$12$R.R8k6dC6zDpxr857wV0GuklH6p.6vQ6/Z2nOsw2Hox29gLz/D45y', 'user', 'Urban planner')
ON CONFLICT (email) DO NOTHING;

-- Seed cities with geo-coordinates
INSERT INTO cities (name, country, coordinates)
VALUES 
('Jaipur', 'India', ST_GeomFromText('POINT(75.7873 26.9124)', 4326)),
('Delhi', 'India', ST_GeomFromText('POINT(77.2090 28.6139)', 4326)),
('New York', 'USA', ST_GeomFromText('POINT(-74.0060 40.7128)', 4326)),
('Tokyo', 'Japan', ST_GeomFromText('POINT(139.6917 35.6762)', 4326))
ON CONFLICT (name) DO NOTHING;
