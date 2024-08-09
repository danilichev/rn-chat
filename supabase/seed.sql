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
      '{"email": "sandy@email.com", "full_name": "Sandy Cheeks"}'::jsonb,
      '{"email": "mickey@email.com", "full_name": "Mickey Mouse"}'::jsonb,
      '{"email": "minnie@email.com", "full_name": "Minnie Mouse"}'::jsonb,
      '{"email": "donald@email.com", "full_name": "Donald Duck"}'::jsonb,
      '{"email": "goofy@email.com", "full_name": "Goofy"}'::jsonb,
      '{"email": "pluto@email.com", "full_name": "Pluto"}'::jsonb,
      '{"email": "bugs@email.com", "full_name": "Bugs Bunny"}'::jsonb,
      '{"email": "daffy@email.com", "full_name": "Daffy Duck"}'::jsonb,
      '{"email": "tweety@email.com", "full_name": "Tweety Bird"}'::jsonb,
      '{"email": "sylvester@email.com", "full_name": "Sylvester the Cat"}'::jsonb,
      '{"email": "elmer@email.com", "full_name": "Elmer Fudd"}'::jsonb,
      '{"email": "fred@email.com", "full_name": "Fred Flintstone"}'::jsonb,
      '{"email": "barney@email.com", "full_name": "Barney Rubble"}'::jsonb,
      '{"email": "wilma@email.com", "full_name": "Wilma Flintstone"}'::jsonb,
      '{"email": "betty@email.com", "full_name": "Betty Rubble"}'::jsonb,
      '{"email": "george@email.com", "full_name": "George Jetson"}'::jsonb,
      '{"email": "jane@email.com", "full_name": "Jane Jetson"}'::jsonb,
      '{"email": "judy@email.com", "full_name": "Judy Jetson"}'::jsonb,
      '{"email": "elroy@email.com", "full_name": "Elroy Jetson"}'::jsonb,
      '{"email": "astro@email.com", "full_name": "Astro"}'::jsonb,
      '{"email": "yogi@email.com", "full_name": "Yogi Bear"}'::jsonb,
      '{"email": "boo@email.com", "full_name": "Boo Boo"}'::jsonb,
      '{"email": "huckleberry@email.com", "full_name": "Huckleberry Hound"}'::jsonb,
      '{"email": "snagglepuss@email.com", "full_name": "Snagglepuss"}'::jsonb,
      '{"email": "topcat@email.com", "full_name": "Top Cat"}'::jsonb,
      '{"email": "tom@email.com", "full_name": "Tom Cat"}'::jsonb,
      '{"email": "jerry@email.com", "full_name": "Jerry Mouse"}'::jsonb,
      '{"email": "popeye@email.com", "full_name": "Popeye"}'::jsonb,
      '{"email": "olive@email.com", "full_name": "Olive Oyl"}'::jsonb,
      '{"email": "bluto@email.com", "full_name": "Bluto"}'::jsonb,
      '{"email": "felix@email.com", "full_name": "Felix the Cat"}'::jsonb,
      '{"email": "garfield@email.com", "full_name": "Garfield"}'::jsonb,
      '{"email": "odie@email.com", "full_name": "Odie"}'::jsonb,
      '{"email": "scooby@email.com", "full_name": "Scooby-Doo"}'::jsonb,
      '{"email": "shaggy@email.com", "full_name": "Shaggy Rogers"}'::jsonb,
      '{"email": "velma@email.com", "full_name": "Velma Dinkley"}'::jsonb,
      '{"email": "daphne@email.com", "full_name": "Daphne Blake"}'::jsonb,
      '{"email": "fredjones@email.com", "full_name": "Fred Jones"}'::jsonb,
      '{"email": "bart@email.com", "full_name": "Bart Simpson"}'::jsonb,
      '{"email": "homer@email.com", "full_name": "Homer Simpson"}'::jsonb,
      '{"email": "marge@email.com", "full_name": "Marge Simpson"}'::jsonb,
      '{"email": "lisa@email.com", "full_name": "Lisa Simpson"}'::jsonb,
      '{"email": "maggie@email.com", "full_name": "Maggie Simpson"}'::jsonb,
      '{"email": "stewie@email.com", "full_name": "Stewie Griffin"}'::jsonb,
      '{"email": "peter@email.com", "full_name": "Peter Griffin"}'::jsonb,
      '{"email": "lois@email.com", "full_name": "Lois Griffin"}'::jsonb
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