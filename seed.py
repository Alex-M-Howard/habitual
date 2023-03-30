import datetime
import random

import requests

API_URL = "http://localhost:3000/api/users/1/tracker"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbGV4YW1oQHpvaG8uY29tIiwiZmlyc3ROYW1lIjoiQWxleCIsImxhc3ROYW1lIjoiSG93YXJkIiwiZGF0ZUpvaW5lZCI6IjIwMjMtMDMtMTVUMDQ6MDA6MDAuMDAwWiIsImlhdCI6MTY4MDE0MDg2NX0.QIczd--0NoRRmxWqG5CetDwQMGAl-GmugA1MlsGFWcs"

headers = {
    "Authorization": f"Bearer {TOKEN}"
}


def random_date():
    start_date = datetime.date(2022, 1, 1)
    end_date = datetime.date(2022, 12, 31)
    days_between = (end_date - start_date).days
    random_days = random.randrange(days_between)

    return (start_date + datetime.timedelta(days=random_days)).isoformat()


for req in range(5000):

    params = {
        "habitId": random.randint(1, 10),
        "date": random_date()
    }

    response = requests.post(url=API_URL, headers=headers, json=params)

    if response.status_code != 200:
        print(response.text)
