# Deal Machine [Public Auctions]

Wholesale inventory hub for auto wholesalers powered by i Finance.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL connection string
   ```

3. Push the database schema:
   ```bash
   npm run db:push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Railway Deployment

1. Create a new project on Railway
2. Add a PostgreSQL database service
3. Connect your repository
4. Set the `DATABASE_URL` environment variable (Railway auto-populates this if you link the DB)
5. Deploy - Railway will use the `railway.toml` and `Dockerfile`

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |

## Project Structure

```
deal-machine/
├── app/
│   ├── admin/          # Admin dashboard
│   ├── api/            # API routes
│   │   ├── sale-events/
│   │   └── vehicles/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── prisma.ts       # Prisma client singleton
├── prisma/
│   └── schema.prisma   # Database schema
├── Dockerfile
├── railway.toml
└── tailwind.config.ts
```
