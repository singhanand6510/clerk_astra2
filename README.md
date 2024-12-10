This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

<!--
user is created only, but in default_keyspace, try to add default keyspace in mongoose as well.

delete , read, update version is still not tested,

and there are three account in your astradb because, you havent integrated the delete user action in the webhooks yet

astra db is creating uique ID itself, lets try to pull user using that uniqe Id,

CreatedAt did not used in model, webhooks, and params, try to make that,

if u are using model and want to use CRUD make sure to use mongoose.

try to add ZeroBounce Package as well for disposable gmail_id's,

just find out how the previously saved astra_auth was not working, is it because i tried updating mongoose connection on local host and not on vercel? then from now on always update on vercel and try...

for uploading vector data to astradb, this documentation is given https://docs.datastax.com/en/astra-db-serverless/integrations/data-api-with-mongoosejs.html

while creating users in the webhook file, clerkClient is also updated in this link for updating the users metadata, in the clerk also with database _id. inthis link "https://clerk.com/docs/users/metadata", also see the updated documentations for fetching the real user data using _id from database, in JSM saas video, and compare the recenty documentation of this link

and now also create chat_thread model, and keep the vector model and connection saperate, try and see what happens???

recharge the Anthropic API and get it done already by today..... and start content generator app _____ e-commerse CMS app, _________ and email newsletter app, ______ web 3.0 by daulat hussain.. and done with your cv too...

 -->
