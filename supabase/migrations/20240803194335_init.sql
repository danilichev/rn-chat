-- Create users table
create table users (
    id uuid primary key references auth.users(id) on delete cascade,
    avatar_url text,
    email text unique,
    full_name text not null,
    created_at timestamptz default current_timestamp,
    updated_at timestamptz default current_timestamp
);

-- Create chats table
create table chats (
    id uuid primary key,
    name text,
    is_group boolean not null default false,
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
create table chat_users (
    chat_id uuid references chats(id) on delete cascade,
    user_id uuid references users(id) on delete cascade,
    primary key (chat_id, user_id)
);


-- Indexes for optimization
create index idx_user_email on users(email);

create index idx_message_chat_id on messages(chat_id);
create index idx_message_user_id on messages(user_id);

create index idx_chat_users_chat_id on chat_users(chat_id);
create index idx_chat_users_user_id on chat_users(user_id);

