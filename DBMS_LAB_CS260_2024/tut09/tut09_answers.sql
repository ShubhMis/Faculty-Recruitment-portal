-- General Instructions
-- 1.	The .sql files are run automatically, so please ensure that there are no syntax errors in the file. If we are unable to run your file, you get an automatic reduction to 0 marks.
-- Comment in MYSQL 
-- 1. List the names of all left-handed batsmen from England. Order the results alphabetically.
SELECT player_name 
FROM player 
WHERE batting_hand = 'Left-hand bat' AND country_name = 'England' 
ORDER BY player_name;

-- 2. List the names and age (in years, should be integer) as on 2018-12-02 of all bowlers with skill “Legbreak googly” who are 28 or more in age. Order the result in decreasing order of their ages. Resolve ties alphabetically.
SELECT player_name, 
       DATE_PART('year', AGE('2018-12-02', dob))::INTEGER AS player_age
FROM player 
WHERE bowling_skill = 'Legbreak googly' AND DATE_PART('year', AGE('2018-12-02', dob)) >= 28
ORDER BY player_age DESC, player_name;

-- 3. List the match ids and toss winning team IDs where the toss winner of a match decided to bat first.
SELECT match_id, toss_winner 
FROM match 
WHERE toss_decision = 'bat'
ORDER BY match_id;

-- 4. In the match with match id 335987, list the over ids and runs scored where at most 7 runs were scored.
SELECT over_id, SUM(extra_runs) + COUNT(ball_id) AS runs_scored 
FROM extra_runs 
WHERE match_id = 335987 
GROUP BY over_id 
HAVING SUM(extra_runs) + COUNT(ball_id) <= 7
ORDER BY runs_scored DESC, over_id;

-- 5. List the names of those batsmen who were bowled at least once in alphabetical order of their names.
SELECT DISTINCT p.player_name 
FROM batsman_scored b 
JOIN player p ON b.player_out = p.player_id 
ORDER BY p.player_name;

-- 6. List all the match ids along with the names of teams participating, name of the winning team, and win margin where the win margin is at least 60 runs.
SELECT m.match_id, t1.name AS team_1, t2.name AS team_2, 
       tw.name AS winning_team_name, win_margin 
FROM match m 
JOIN team t1 ON m.team_1 = t1.team_id 
JOIN team t2 ON m.team_2 = t2.team_id 
JOIN team tw ON m.match_winner = tw.team_id 
WHERE win_margin >= 60 
ORDER BY win_margin, m.match_id;

-- 7. List the names of all left-handed batsmen below 30 years of age as on 2018-12-02.
SELECT player_name 
FROM player 
WHERE batting_hand = 'Left-hand bat' AND DATE_PART('year', AGE('2018-12-02', dob)) < 30 
ORDER BY player_name;

-- 8. List the match wise total for the entire series.
SELECT match_id, 
       SUM(extra_runs) + SUM(extra_runs) AS total_runs 
FROM extra_runs 
GROUP BY match_id 
ORDER BY match_id;

-- 9. For each match id, list the maximum runs scored in any over and the bowler bowling in that over.
SELECT m.match_id, MAX(e.extra_runs) AS maximum_runs, p.player_name 
FROM extra_runs e 
JOIN ball_by_ball b ON e.match_id = b.match_id AND e.over_id = b.over_id AND e.ball_id = b.ball_id 
JOIN player p ON b.bowler = p.player_id 
JOIN match m ON e.match_id = m.match_id 
GROUP BY m.match_id, p.player_name 
ORDER BY m.match_id, maximum_runs DESC;

-- 10. List the names of batsmen and the number of times they have been “run out”.
SELECT p.player_name, COUNT(*) AS number 
FROM batsman_scored bs 
JOIN player p ON bs.player_out = p.player_id 
WHERE kind_out = 'run out' 
GROUP BY p.player_name 
ORDER BY number DESC, p.player_name;

-- 11. List the number of times any batsman has got out for any out type.
SELECT kind_out, COUNT(*) AS number 
FROM batsman_scored 
GROUP BY kind_out 
ORDER BY number DESC, kind_out;

-- 12. List the team name and the number of times any player from the team has received man of the match award.
SELECT t.name, COUNT(*) AS number 
FROM match m 
JOIN team t ON m.man_of_the_match = t.team_id 
GROUP BY t.name 
ORDER BY t.name;

-- 13. Find the venue where the maximum number of wides have been given.
SELECT venue 
FROM match 
GROUP BY venue 
ORDER BY COUNT(CASE WHEN extra_type = 'wide' THEN 1 END) DESC, venue 
LIMIT 1;

-- 14. Find the venue(s) where the team bowling first has won the match.
SELECT venue 
FROM match 
WHERE team_batting = match_winner 
GROUP BY venue 
ORDER BY COUNT(*) DESC, venue;

-- 15. Find the bowler who has the best average overall.
SELECT p.player_name 
FROM ball_by_ball b 
JOIN player p ON b.bowler = p.player_id 
GROUP BY p.player_name 
HAVING COUNT(*) > 0 
ORDER BY (SUM(b.extra_runs) + COUNT() * 6) / COUNT() ASC, p.player_name 
LIMIT 1;

-- 16. List the players and the corresponding teams where the player played as “CaptainKeeper” and won the match.
SELECT p.player_name, t.name 
FROM player_match pm 
JOIN player p ON pm.player_id = p.player_id 
JOIN team t ON pm.team_id = t.team_id 
WHERE pm.role = 'CaptainKeeper' AND pm.match_id IN (
    SELECT match_id 
    FROM match 
    WHERE match_winner = pm.team_id
) 
ORDER BY p.player_name;

-- 17. List the names of all players and their runs scored (who have scored at least 50 runs in any match).
SELECT p.player_name, SUM(extra_runs) + COUNT(*) * 6 AS runs_scored 
FROM ball_by_ball b 
JOIN player p ON b.striker = p.player_id 
GROUP BY p.player_name 
HAVING SUM(extra_runs) + COUNT(*) * 6 >= 50 
ORDER BY runs_scored DESC, p.player_name;

-- 18. List the player names who scored a century but their teams lost the match.
SELECT p.player_name 
FROM ball_by_ball b 
JOIN player p ON b.striker = p.player_id 
WHERE (SUM(extra_runs) + COUNT(*) * 6) >= 100 
  AND b.innings_no = 1 
  AND b.match_id IN (
      SELECT match_id 
      FROM match 
      WHERE match_winner != b.team_batting
  ) 
GROUP BY p.player_name 
ORDER BY p.player_name;
