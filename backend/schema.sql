-- ChromaSync Aura - Database Schema (PostgreSQL)

-- Global Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_plan AS ENUM ('FREE', 'PLUS', 'PRO');
CREATE TYPE collaboration_role AS ENUM ('OWNER', 'EDITOR', 'VIEWER');

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    plan user_plan DEFAULT 'FREE',
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Palettes Table
CREATE TABLE palettes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    colors JSONB NOT NULL, -- Array of {hex: string, name: string, ratio: number}
    is_public BOOLEAN DEFAULT false,
    ai_generated BOOLEAN DEFAULT false,
    origin_image_url TEXT, -- If generated from image
    accessibility_data JSONB, -- Contrast scores, simulator results
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Moodboards (Collections of Palettes and Assets)
CREATE TABLE moodboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    is_shared BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Relation: Moodboards <-> Palettes
CREATE TABLE moodboard_palettes (
    moodboard_id UUID REFERENCES moodboards(id) ON DELETE CASCADE,
    palette_id UUID REFERENCES palettes(id) ON DELETE CASCADE,
    PRIMARY KEY (moodboard_id, palette_id)
);

-- Collaboration & Teams
CREATE TABLE collaborations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_type TEXT NOT NULL, -- 'palette' or 'moodboard'
    resource_id UUID NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role collaboration_role DEFAULT 'VIEWER',
    invited_by UUID REFERENCES users(id),
    status TEXT DEFAULT 'PENDING', -- PENDING, ACCEPTED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comments System
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES comments(id), -- For threaded replies
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Gamification & User Activity
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- 'swipe_like', 'palette_save', 'export'
    points_earned INTEGER DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Badges
CREATE TABLE user_badges (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_name TEXT NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_name)
);

-- Indexing for performance
CREATE INDEX idx_palettes_owner ON palettes(owner_id);
CREATE INDEX idx_comments_resource ON comments(resource_id);
CREATE INDEX idx_activity_user ON activity_log(user_id);
