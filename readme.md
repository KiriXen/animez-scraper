## Getting Started
1. `git clone https://github.com/KiriXen/animez-scraper.git`
2. `npm i or npm install`
3. `npm run start`
   
## Base URL
`http://localhost:5000` 

All endpoints are prefixed with `/api/anime`.


## Endpoints


<details>
  <summary><strong> Latest :</strong></summary> <hr>

**Endpoint:**
```
GET /api/anime/latest?page=1
```

**Description:**
Fetches a list of anime based on the latest episode

**Query Parameters:**
- `page` (optional) - Specifies the page number for pagination.
  - Default: `1`

```
GET http://localhost:5000/api/anime/latest?page=1
```
<hr>
</details>

<details>
  <summary><strong>Details :</strong></summary> <hr>

**Endpoint:**
```
GET api/anime/details/:animeId?type=sub/dub
```

**Description:**
Fetches the anime description

**Query Parameters:**
- `animeId` (required) - the anime id
- `type` - Filter by anime status.
  - Possible values: `sub - returns the sub episodes`, `dub - returns the dub episode`

```
GET http://localhost:5000/api/anime/details/seirei-gensouki-spirit-chronicles-5838?type=sub
``` 
<hr>
</details>

<details>
  <summary><strong>Episodes :</strong></summary> <hr>

**Endpoint:**
```
GET api/anime/:animeId/:episodeId
```

**Description:**
Fetches the anime episode

**Query Parameters:**
- `animeId` (required) - the anime id
- `episodeId` (required) - the episode id

```
GET http://localhost:5000/api/anime/seirei-gensouki-spirit-chronicles-5838/epi-12dub-171199
``` 
<hr>
</details>

<details>
  <summary><strong>Genres :</strong></summary> <hr>
  
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
  - Possible values: `lastest-chap`, `hot`, `lastest-manga`, `top-manga`, `top-month`, `top-week`, `top-day`, `follow`, `comment`, `num-chap`
  - Default: `lastest-chap`
- `page` (optional) - Specifies the page number for pagination.
  - Default: `1`

```
GET http://localhost:5000/api/anime/genre/action?status=all&sortBy=lastest-chap&page=1
```

<hr>
</details>


<details>
  <summary><strong>Search :</strong></summary> <hr>
  
**Endpoint:**
```
GET /api/anime/search?query=anime
```

**Description:**
Fetches a list of anime based on the query

**Query Parameters:**
- `status` (optional) - Filter by anime status.
  - Possible values: `all`, `completed`, `in-process`, `paused`
  - Default: `all`
- `sortBy` (optional) - Sorting order of the results.
  - Possible values: `lastest-chap`, `hot`, `lastest-manga`, `top-manga`, `top-month`, `top-week`, `top-day`, `follow`, `comment`, `num-chap`
  - Default: `lastest-chap`
- `page` (optional) - Specifies the page number for pagination.
  - Default: `1`

```
GET http://localhost:5000/api/anime/search?query=anime&status=all&sortBy=hot&page=1
```

<hr>
</details>

If you have suggestions or feature requests, feel free to open an issue!
