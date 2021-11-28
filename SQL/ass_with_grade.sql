SELECT api_ass.id     AS assignment_id,
       grade,
       title,
       users.username AS teacher_username
FROM   (api_assignment AS api_ass
        LEFT JOIN (SELECT *
                   FROM   api_gradedassignment
                   WHERE  student_id = 3) AS grades
               ON api_ass.id = grades.assignment_id)
       INNER JOIN users_user AS users
               ON teacher_id = users.id 