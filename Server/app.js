import express from 'express'
import userRoute from './routes/user.js'

const app = express();

app.use("/user", userRoute)

app.get("/", (req, res) => {
    console.log("Hello world")
})


app.listen(3000, () => {
    console.log(`App is listening on 3000`)
})