-- Enable row level security
alter table users enable row level security;

create policy "Users are viewable by everyone." on users
  for select using (true);

create policy "User can insert their own data." on users
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own data." on users
  for update using ((select auth.uid()) = id);

-- inserts a row into public.users every time a new user is created
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.raw_user_meta_data ->> 'email', new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();