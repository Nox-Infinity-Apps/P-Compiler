import uuid
from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from typing import Union
import psycopg2
from dtos.user.user import UserData, SubmissionStatistics
from utils.env import Environment



@dataclass
class DatabaseService:

    @staticmethod
    def addUser(env: Environment, user:UserData) -> Union[None, str]:
        try:
            conn = psycopg2.connect(
                host=env.db_postgres_host,
                database=env.db_postgres_name,
                user=env.db_postgres_user,
                password=env.db_postgres_password,
            )
            cur = conn.cursor()
            cur.execute("SELECT * FROM public.\"User\" WHERE account = %s", (user.account,))
            user_id = str(uuid.uuid4())

            def parse_date(date_str):
                try:
                    return datetime.strptime(date_str, "%d/%m/%Y").date()
                except (ValueError, TypeError):
                    return None

            if not cur.fetchone():
                cur.execute(
                    "INSERT INTO public.\"User\" "
                    "(id, name, email, account, class_, date, gender, location, phone, description, enable_notify, createdAt, updatedAt) "
                    "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, False, DEFAULT, DEFAULT)",
                    (user_id, user.username, user.email, user.account, user.class_, parse_date(user.date), user.gender,
                     user.location, user.phone, user.description)
                )
            conn.commit()
            cur.close()
        except Exception as e:
            return str(e)

    def addSubmitsion(env: Environment, data: any, course: str) -> Union[None, str]:
        try:
            conn = psycopg2.connect(
                host=env.db_postgres_host,
                database=env.db_postgres_name,
                user=env.db_postgres_user,
                password=env.db_postgres_password,
            )

            cur = conn.cursor()
            cur.execute("SELECT id FROM public.\"User\" WHERE account = %s", (data.username,))
            user_result = cur.fetchone()
            if not user_result:
                return "User not found"
            user_id = user_result[0]
            cur.execute(
                "INSERT INTO public.\"submissions\" "
                "(id, userId, courseId, problem, problem_name, status, date, time, result, memory, run_time, compiler, color, createdAt, updatedAt) "
                "VALUES (DEFAULT, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, DEFAULT, DEFAULT)",
                (
                    user_id, course, data.problem, data.problem_name, data.status, data.date, data.time,
                    data.result, data.memory, data.run_time, data.compiler, data.color
                )
            )

            conn.commit()
            cur.close()
            conn.close()
        except Exception as e:
            return f"Error: {str(e)}"

    def getStatistics(env:Environment, user_id:str, from_date , to_date) ->Union[None, SubmissionStatistics]:
        try:
            conn = psycopg2.connect(
                host=env.db_postgres_host,
                database=env.db_postgres_name,
                user=env.db_postgres_user,
                password=env.db_postgres_password,
            )
            cur = conn.cursor()
            query = """
                    SELECT 
                      COUNT(*) AS total_submissions,
                      COUNT(CASE WHEN result = 'AC' THEN 1 END) AS total_ac,
                      ROUND(COUNT(CASE WHEN result = 'AC' THEN 1 END)::numeric / COUNT(*) * 100, 2) AS ac_percentage,
                      COUNT(CASE WHEN result != 'AC' THEN 1 END) AS total_non_ac,
                      COUNT(CASE WHEN result = 'WA' THEN 1 END) AS total_wa,
                      ROUND(COUNT(CASE WHEN result = 'WA' THEN 1 END)::numeric / COUNT(*) * 100, 2) AS wa_percentage,
                      COUNT(CASE WHEN result = 'TLE' THEN 1 END) AS total_tle,
                      ROUND(COUNT(CASE WHEN result = 'TLE' THEN 1 END)::numeric / COUNT(*) * 100, 2) AS tle_percentage,
                      COUNT(CASE WHEN result = 'IR' THEN 1 END) AS total_ir,
                      ROUND(COUNT(CASE WHEN result = 'IR' THEN 1 END)::numeric / COUNT(*) * 100, 2) AS ir_percentage,
                      COUNT(CASE WHEN result = 'RTE' THEN 1 END) AS total_rte,
                      ROUND(COUNT(CASE WHEN result = 'RTE' THEN 1 END)::numeric / COUNT(*) * 100, 2) AS rte_percentage
                    FROM submissions
                    WHERE userid = %s AND date BETWEEN %s AND %s;
                    """
            cur.execute(query, (user_id, from_date, to_date))
            result = cur.fetchone()
            if not result:
                return None
            else :
                def convert_decimal_to_float(value):
                    if isinstance(value, Decimal):
                        return float(value)
                    return value
                res = [convert_decimal_to_float(value) for value in result]
                # Map quan class SubmissionStatistics
                return SubmissionStatistics(*res)
        except Exception as e:
            return print(f"Error: {e}")

    def getUserIdByAccount(env: Environment, account: str) -> Union[str, None]:
        try:
            conn = psycopg2.connect(
                host=env.db_postgres_host,
                database=env.db_postgres_name,
                user=env.db_postgres_user,
                password=env.db_postgres_password,
            )
            cur = conn.cursor()
            cur.execute("SELECT id FROM public.\"User\" WHERE account = %s", (account,))
            user_id = cur.fetchone()
            return user_id[0] if user_id else None
        except Exception as e:
            print(f"Error: {e}")
            return None

