## Environment Variables

To run this project, you need to set up the following environment variables. Copy the `.env.example` file to `.env` and fill in your Tavus credentials:

```sh
cp .env.example .env
```

Then edit `.env` and set:
- `TAVUS_API_KEY` (your Tavus API key)
- `TAVUS_PERSONA_ID` (your Tavus persona ID)
- `TAVUS_REPLICA_ID` (your Tavus replica ID)
- `TAVUS_BASE_URL` (optional, default is https://tavusapi.com)

**Never commit your real `.env` file or secrets to version control.** 