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

