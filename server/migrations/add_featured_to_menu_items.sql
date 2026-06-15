-- Migration: Add featured column to menu_items
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
