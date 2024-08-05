create or replace function public.create_user_metadata(email text, password text, user_meta_data jsonb)
returns uuid
language plpgsql
security definer
as $function$
declare
  user_id uuid;
  encrypted_pw text;
begin
  user_id := gen_random_uuid();
  encrypted_pw := crypt(password, gen_salt('bf'));
  
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, 
    email_confirmed_at, recovery_sent_at, last_sign_in_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
    confirmation_token, email_change, email_change_token_new, recovery_token
  )
  values (
    '00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', 
    email, encrypted_pw, now(), now(), now(), 
    '{"provider":"email","providers":["email"]}', user_meta_data, now(), now(), 
    '', '', '', ''
  );
  
  insert into auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  )
  values (
    gen_random_uuid(), user_id, format('{"sub":"%s","email":"%s"}', user_id::text, email)::jsonb, 
    'email', user_id, now(), now(), now()
  );

  return user_id;
end;
$function$;

do $$
declare
    user_data jsonb[] := array[
        '{"email": "bob@email.com", "full_name": "Sponge Bob"}'::jsonb,
        '{"email": "patrick@email.com", "full_name": "Patrick Star"}'::jsonb,
        '{"email": "squidward@email.com", "full_name": "Squidward Tentacles"}'::jsonb,
        '{"email": "krabs@email.com", "full_name": "Mr. Krabs"}'::jsonb,
        '{"email": "sandy@email.com", "full_name": "Sandy Cheeks"}'::jsonb
    ];
    common_password text := 'Qweqwe123';
begin
    for i in 1..array_length(user_data, 1) loop
        perform public.create_user_metadata(
            user_data[i]->>'email',
            common_password,
            user_data[i]
        );
    end loop;
end $$;