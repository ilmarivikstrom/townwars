import express from 'express'
const app = express();
const port : number = 5172;

app.use(express.json());

app.get('/api/time', (req, res) => {
  res.json({ message: Date.now().toString() });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
})

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${5172}`);
});
