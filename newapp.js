const express = require('express');
const sql = require('mssql');
const app = express();
const port = 3005;

const dbConfig = {
        server: 'localhost',
        database: 'NPBookstore',
        user: 'sa',
        password: 'pA$$0112358132134',
        port: 1433,
        options: {
    trustServerCertificate: true, // local development
  },
}

app.use(express.json());

// Session 1 OAL: the first route. A plain text response.
app.get('/', (req, res) => {
  res.send('Hello from bookcat-api!');
});

// Session 1 OAL: a route that sends JSON. The data is a hardcoded array
// that lives in memory, so it resets every time the server restarts.
const categories = [
  { id: 1, name: 'Fiction' },
  { id: 2, name: 'Science' },
  { id: 3, name: 'History' },
];

app.get('/categories', (req, res) => {
  res.json(categories);
});

app.get('/authors', async (req, res) => {
    let connection;
    try{
        connection = await sql.connect(dbConfig);
        const result = await connection.request().query('SELECT AuthorID, Name FROM Author');
        res.status(200).json(result.recordset);
    }
    catch (err){
        console.error('Database connection failed:', err);
        res.status(500).json({ error: 'Database connection failed' });
    }
    finally {
        if (connection) {
            await connection.close();
        }
    }
})

app.get('/authors/:id', async (req, res) => {
    const authorID = parseInt(req.params.id);
    if(isNaN(authorID)){
        res.status(400).json({ error: 'Invalid author ID' });
    }

    let connection;
    try{
        connection = await sql.connect(dbConfig);
        const request = await connection.request();        
        request.input('id', authorID);
        
        const result = await request.query('SELECT AuthorID, Name FROM Author WHERE AuthorID = @id');

        if(result.recordset.length === 0){
            res.status(404).json({ error: 'Author not found' });
        }
        res.status(200).json(result.recordset[0]);

    }catch (err){
        console.error('Database connection failed:', err);
        res.status(500).json({ error: 'Database connection failed' });
    }
    finally {
        if (connection) {
            await connection.close();
        }
    }
})

app.post('/authors', async (req, res) => {
  
    const { id, name } = req.body;
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const request = connection.request();
        request.input('id', id);
        request.input('name', name);
    const result = await request.query(
      'INSERT INTO Author (AuthorID, Name) OUTPUT INSERTED.* VALUES (@id, @name)'
    );
    // OUTPUT INSERTED.* returns the row exactly as stored.
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error('Error closing connection:', closeErr);
      }
    }
  }
});


app.listen(port, () => {
  console.log(`bookcat-api listening on http://localhost:${port}`);
});