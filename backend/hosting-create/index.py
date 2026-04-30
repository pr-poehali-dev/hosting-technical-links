import json
import os
import re
import random
import psycopg2
from datetime import datetime

ADJECTIVES = [
    "быстрый", "надёжный", "стабильный", "умный", "точный",
    "чёткий", "верный", "чистый", "мощный", "лёгкий"
]

NOUNS_RU = [
    "сервер", "портал", "хостинг", "узел", "ресурс",
    "сайт", "платформа", "система", "домен", "хаб"
]

NOUNS_TECH = [
    "srv", "host", "node", "hub", "net",
    "web", "app", "cloud", "site", "link"
]

def translit(text: str) -> str:
    table = {
        'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo',
        'ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m',
        'н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u',
        'ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'sch',
        'ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
        ' ':'-'
    }
    return ''.join(table.get(c.lower(), c) for c in text)

def generate_tech_url(adj: str, noun: str) -> str:
    adj_t = translit(adj)
    num = random.randint(10, 99)
    return f"https://{adj_t}-{noun}{num}.госуслуги-хостинг.рф"

def generate_domain_ru(adj: str, noun_ru: str) -> str:
    adj_t = adj.replace('ё', 'е')
    noun_t = noun_ru.replace('ё', 'е')
    return f"{adj_t}-{noun_t}.рф"


def handler(event: dict, context) -> dict:
    """Создаёт новый хостинг с уникальной технической ссылкой и доменом .рф"""

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    if not name:
        name = f"Хостинг {datetime.now().strftime('%d.%m.%Y %H:%M')}"

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    # Generate unique urls
    for _ in range(20):
        adj = random.choice(ADJECTIVES)
        noun_tech = random.choice(NOUNS_TECH)
        noun_ru = random.choice(NOUNS_RU)
        tech_url = generate_tech_url(adj, noun_tech)
        domain_ru = generate_domain_ru(adj, noun_ru)

        cur.execute("SELECT 1 FROM hostings WHERE tech_url = %s OR domain_ru = %s", (tech_url, domain_ru))
        if not cur.fetchone():
            break

    cur.execute(
        "INSERT INTO hostings (name, domain_ru, tech_url) VALUES (%s, %s, %s) RETURNING id, name, domain_ru, tech_url, created_at",
        (name, domain_ru, tech_url)
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {**cors, 'Content-Type': 'application/json'},
        'body': json.dumps({
            'id': str(row[0]),
            'name': row[1],
            'domain_ru': row[2],
            'tech_url': row[3],
            'created_at': row[4].isoformat(),
        }, ensure_ascii=False)
    }
