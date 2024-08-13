-- Create a view to find one-to-one chats
create view one_to_one_chats as
select 
    c.id as chat_id,
    cu1.user_id as user1_id,
    cu2.user_id as user2_id
from 
    chats c
join 
    chat_users cu1 on c.id = cu1.chat_id
join 
    chat_users cu2 on c.id = cu2.chat_id
where 
    c.is_group = false
    and cu1.user_id < cu2.user_id;

-- Create the function to check the user limit for one-to-one chats
create or replace function check_one_to_one_chat_user_limit()
returns trigger as $$
begin
    if (select count(*) from chat_users where chat_id = new.chat_id) >= 2 and 
       (select is_group from chats where id = new.chat_id) = false then
        raise exception 'Cannot add more users to a one-to-one chat';
    end if;
    return new;
end;
$$ language plpgsql;

-- Create the trigger to enforce the user limit for one-to-one chats
create trigger one_to_one_chat_user_limit_trigger
before insert on chat_users
for each row
execute function check_one_to_one_chat_user_limit();