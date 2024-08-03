-- Create users table
create table users (
    id uuid primary key references auth.users(id) on delete cascade,
    avatar_url text not null,
    email text unique,
    full_name text not null,
    created_at timestamptz default current_timestamp,
    updated_at timestamptz default current_timestamp
);

-- Create chats table
create table chats (
    id uuid primary key,
    title text,
    created_at timestamptz default current_timestamp,
    updated_at timestamptz default current_timestamp
);

-- Create messages table
create table messages (
    id uuid primary key,
    chat_id uuid references chats(id) on delete cascade,
    text text not null,
    user_id uuid references users(id) on delete cascade,
    created_at timestamptz default current_timestamp,
    updated_at timestamptz default current_timestamp
);

-- Create chat_users join table
create table user_chats (
    user_id uuid references users(id) on delete cascade,
    chat_id uuid references chats(id) on delete cascade,
    primary key (user_id, chat_id)
);

-- Indexes for optimization
create index idx_user_email on users(email);
create index idx_message_chat_id on messages(chat_id);
create index idx_message_user_id on messages(user_id);
