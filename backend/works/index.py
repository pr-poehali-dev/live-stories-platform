import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event: dict, context) -> dict:
    '''
    Управление произведениями автора: список, создание, редактирование, публикация, удаление.
    Также сохраняет подписчиков. Хранит книги и истории в базе данных.
    '''
    method = event.get('httpMethod', 'GET')
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True
    cur = conn.cursor(cursor_factory=RealDictCursor)

    params = event.get('queryStringParameters') or {}
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            body = {}

    def esc(v):
        return str(v).replace("'", "''")

    if method == 'GET':
        resource = params.get('resource', 'works')
        if resource == 'subscribers':
            cur.execute("SELECT id, email, plan, status, created_at FROM subscribers ORDER BY created_at DESC")
            rows = cur.fetchall()
            cur.close()
            conn.close()
            return _ok(cors, {'subscribers': [_row(r) for r in rows]})

        only_published = params.get('published') == '1'
        where = "WHERE status = 'published'" if only_published else ""
        cur.execute(f"SELECT * FROM works {where} ORDER BY COALESCE(published_at, updated_at) DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return _ok(cors, {'works': [_row(r) for r in rows]})

    if method == 'POST':
        action = body.get('action', 'create_work')

        if action == 'subscribe':
            email = esc(body.get('email', '').strip().lower())
            plan = esc(body.get('plan', 'free'))
            if not email:
                return _err(cors, 'email required')
            cur.execute(
                f"INSERT INTO subscribers (email, plan) VALUES ('{email}', '{plan}') "
                f"ON CONFLICT (email) DO UPDATE SET plan = '{plan}', status = 'active' RETURNING id"
            )
            sid = cur.fetchone()['id']
            cur.close()
            conn.close()
            return _ok(cors, {'id': sid, 'subscribed': True})

        wtype = esc(body.get('type', 'story'))
        title = esc(body.get('title', ''))
        emoji = esc(body.get('cover_emoji', ''))
        content = esc(body.get('content', ''))
        access = esc(body.get('access', 'free'))
        status = esc(body.get('status', 'draft'))
        pub = "published_at = NOW()," if status == 'published' else ""
        cur.execute(
            f"INSERT INTO works (type, title, cover_emoji, content, access, status, {('published_at,' if status=='published' else '')} updated_at) "
            f"VALUES ('{wtype}', '{title}', '{emoji}', '{content}', '{access}', '{status}', "
            f"{('NOW(),' if status=='published' else '')} NOW()) RETURNING *"
        )
        row = cur.fetchone()
        cur.close()
        conn.close()
        return _ok(cors, {'work': _row(row)})

    if method == 'PUT':
        wid = int(body.get('id', 0))
        if not wid:
            return _err(cors, 'id required')
        sets = []
        for field in ['type', 'title', 'cover_emoji', 'content', 'access', 'status']:
            if field in body:
                sets.append(f"{field} = '{esc(body[field])}'")
        if body.get('status') == 'published':
            sets.append("published_at = COALESCE(published_at, NOW())")
        sets.append("updated_at = NOW()")
        cur.execute(f"UPDATE works SET {', '.join(sets)} WHERE id = {wid} RETURNING *")
        row = cur.fetchone()
        cur.close()
        conn.close()
        if not row:
            return _err(cors, 'not found', 404)
        return _ok(cors, {'work': _row(row)})

    if method == 'DELETE':
        wid = int(params.get('id', 0) or body.get('id', 0))
        if not wid:
            return _err(cors, 'id required')
        cur.execute(f"DELETE FROM works WHERE id = {wid}")
        cur.close()
        conn.close()
        return _ok(cors, {'deleted': True})

    cur.close()
    conn.close()
    return _err(cors, 'method not allowed', 405)


def _row(r):
    d = dict(r)
    for k in ['created_at', 'updated_at', 'published_at']:
        if d.get(k):
            d[k] = d[k].isoformat()
    return d


def _ok(cors, data):
    return {'statusCode': 200, 'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps(data, ensure_ascii=False), 'isBase64Encoded': False}


def _err(cors, msg, code=400):
    return {'statusCode': code, 'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': msg}, ensure_ascii=False), 'isBase64Encoded': False}
