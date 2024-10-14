import express from 'express';
import { authRouter } from './routes/auth-router';
import { notesRouter } from './routes/notes-router';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/auth',authRouter)

app.use('/notes', notesRouter)

app.get('/', (req, res) => {
    res.send('Hello World!')
});


app.listen(3000, ()=> console.log('Server is running on port ', port));