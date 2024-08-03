-- Enable row level security
alter table users enable row level security;

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