select users.id, users.username, users.email
from
users_user as users
left join
(select student_id, attempt_start_time, attempt_end_time from api_gradedassignment where assignment_id = 63) AS graded_assgns
on users.id = graded_assgns.student_id
where attempt_end_time not null;




select users.id, users.username, users.email
from
users_user as users
left join
(select student_id, attempt_start_time, attempt_end_time from api_gradedassignment where assignment_id = 63) AS graded_assgns
on users.id = graded_assgns.student_id
where attempt_end_time is null;