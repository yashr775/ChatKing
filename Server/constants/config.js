const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:4173", process.env.CLIENT_URL],
    credentials: true

}

const CHATKING_TOKEN = "chatKingToken"

export { corsOptions, CHATKING_TOKEN }