import { isAuthenticated } from "../middlewares/auth";
import { newGroupChat } from "../routes/chat";

const app = express.Router();

app.use(isAuthenticated);

app.get('/new', newGroupChat)

export default app;