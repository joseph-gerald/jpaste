---
name: jpaste
description: A simple pastebin service for sharing code snippets with optional passwords and view limits.
license: AGPL
---

# JPaste API

Pastebin service for creating and sharing code snippets with optional passwords and view limits.
Domain: paste.jooo.tech

## Endpoints

### POST /api/v1/ping
Health check. Returns `pong`.

### PUT /api/v1/paste
Create paste.

**Body:**
- `content` (string, 1-1M chars) - paste content
- `title` (string, 2-100 chars) - paste title
- `author` (string, 2-20 chars) - author name
- `syntax` (string) - language (javascript, python, etc)
- `max_reads` (number) - max views (-1 = unlimited)
- `read_key` (string, optional) - view password
- `edit_key` (string, optional) - edit password

**Response:** `{ "code": "XXXX" }`

### GET /:code
View paste as HTML. Auto-increments read counter if unprotected.

**Responses:**
- 200: HTML page with paste
- 404: Paste not found
- 410: Max reads exceeded

### GET /:code/raw
View paste as plain text. Auto-increments read counter if unprotected.

**Responses:**
- 200: Raw content (Content-Type: text/plain)
- 404: Paste not found
- 410: Max reads exceeded

### POST /:code
View protected paste with password.

**Body:** `{ "key": "password" }`

**Response:**
```json
{
  "title": "string",
  "author": "string",
  "content": "string (URL-encoded)",
  "syntax": "string",
  "max_reads": number,
  "reads": number,
  "mutable": boolean
}
```

**Responses:**
- 200: Success
- 404: Paste not found
- 403: Invalid key or max reads exceeded

### GET /robots.txt
Standard robots.txt for crawlers.

### GET /robots.min.txt
Minified robots.txt.

## Paste Schema

```
code      - 4-char uppercase alphanumeric ID (auto-generated)
content   - 1-1M chars (URL-encoded in JSON responses)
title     - 2-100 chars
author    - 2-20 chars
syntax    - language/type for syntax highlighting
max_reads - max views (-1 = unlimited, counts unprotected views only)
reads     - current read count (auto-incremented)
read_key  - optional view password (2-20 chars)
edit_key  - optional edit password (2-20 chars, not implemented yet)
```

## Common Workflows

**Create & Share:**
1. PUT /api/v1/paste → get code
2. Share: https://yourdomain.com/[code]

**Protected Paste:**
1. PUT /api/v1/paste with read_key
2. Share code + password separately
3. Recipients POST to /:code with key

**Limited Views:**
1. PUT /api/v1/paste with max_reads: N
2. After N views, returns 410 Gone

**Raw Content:**
1. GET /:code/raw → plain text without HTML
2. Good for automated processing

## Status Codes

- **200** - Success
- **400** - Missing/invalid required fields
- **403** - Invalid password or max reads exceeded
- **404** - Paste not found
- **410** - Paste expired (max reads exceeded)
- **500** - Database error

## Limits

- Content: 1-1,000,000 chars
- Body: 500MB max
- Title: 2-100 chars
- Author: 2-20 chars
- Keys: 2-20 chars
- Code: 4 uppercase alphanumeric (auto-generated)
- Possible codes: 456,976 combinations
