import json
import os
import base64
import uuid
import mimetypes
import boto3
import psycopg2

def handler(event: dict, context) -> dict:
    """Загружает файл в S3 и сохраняет метаданные для указанного хостинга"""

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    hosting_id = body.get('hosting_id', '').strip()
    original_name = body.get('filename', 'file').strip()
    file_b64 = body.get('file_data', '')
    content_type = body.get('content_type', 'application/octet-stream')

    if not hosting_id or not file_b64:
        return {
            'statusCode': 400,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'hosting_id и file_data обязательны'}, ensure_ascii=False)
        }

    file_bytes = base64.b64decode(file_b64)
    size_bytes = len(file_bytes)

    ext = original_name.rsplit('.', 1)[-1].lower() if '.' in original_name else 'bin'
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    s3_key = f"hostings/{hosting_id}/{unique_name}"

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )

    s3.put_object(
        Bucket='files',
        Key=s3_key,
        Body=file_bytes,
        ContentType=content_type
    )

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{s3_key}"

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute("SELECT id FROM hostings WHERE id = %s", (hosting_id,))
    if not cur.fetchone():
        cur.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Хостинг не найден'}, ensure_ascii=False)
        }

    cur.execute(
        """INSERT INTO hosting_files (hosting_id, filename, original_name, content_type, size_bytes, s3_key, cdn_url)
           VALUES (%s, %s, %s, %s, %s, %s, %s)
           RETURNING id, filename, original_name, content_type, size_bytes, cdn_url, uploaded_at""",
        (hosting_id, unique_name, original_name, content_type, size_bytes, s3_key, cdn_url)
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
            'filename': row[1],
            'original_name': row[2],
            'content_type': row[3],
            'size_bytes': row[4],
            'cdn_url': row[5],
            'uploaded_at': row[6].isoformat(),
        }, ensure_ascii=False)
    }
