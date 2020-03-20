// require('dotenv').config();
import app from './components/app';
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server Listening On Port ${port}\nPress Ctrl-C to stop it\n`);
});