# Anime API

## Endpoints

### Get Anime by Genre

**Endpoint:**
```
GET /api/anime/genre/:genre
```

**Description:**
Fetches a list of anime based on the specified genre.

**Query Parameters:**
- `status` (optional) - Filter by anime status.
  - Possible values: `all`, `completed`, `in-process`, `paused`
  - Default: `all`
- `sortBy` (optional) - Sorting order of the results.
  - Possible values: `lastest-chap`, `popular`, `newest`
  - Default: `lastest-chap`
- `page` (optional) - Specifies the page number for pagination.
  - Default: `1`

**Example Request:**
```
GET http://localhost:5000/api/anime/genre/action?status=all&sortBy=lastest-chap&page=1
```

**Example Response:**
```json
{
  "genre": "action",
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "results": [
    {
      "id": "anime-123",
      "title": "Example Anime",
      "image": "https://example.com/anime.jpg",
      "episodes": 12,
      "url": "https://animez.org/anime-123"
    }
  ]
}
```

Let me know if you need any modifications!
