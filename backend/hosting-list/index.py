import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Возвращает список хостингов с файлами"""

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute("""
        SELECT h.id, h.name, h.domain_ru, h.tech_url, h.created_at,
               COUNT(f.id) as file_count,
               COALESCE(SUM(f.size_bytes), 0) as total_size
        FROM hostings h
        LEFT JOIN hosting_files f ON f.hosting_id = h.id
        GROUP BY h.id, h.name, h.domain_ru, h.tech_url, h.created_at
        ORDER BY h.created_at DESC
    """)
    rows = cur.fetchall()

    hostings = []
    for row in rows:
        hosting_id = str(row[0])

        cur.execute("""
            SELECT id, original_name, content_type, size_bytes, cdn_url, uploaded_at
            FROM hosting_files WHERE hosting_id = %s ORDER BY uploaded_at DESC
        """, (hosting_id,))
        files = cur.fetchall()

        hostings.append({
            'id': hosting_id,
            'name': row[1],
            'domain_ru': row[2],
            'tech_url': row[3],
            'created_at': row[4].isoformat(),
            'file_count': row[5],
            'total_size': row[6],
            'files': [
                {
                    'id': str(f[0]),
                    'original_name': f[1],
                    'content_type': f[2],
                    'size_bytes': f[3],
                    'cdn_url': f[4],
                    'uploaded_at': f[5].isoformat(),
                }
                for f in files
            ]
        })

    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {**cors, 'Content-Type': 'application/json'},
        'body': json.dumps({'hostings': hostings}, ensure_ascii=False)
    }
