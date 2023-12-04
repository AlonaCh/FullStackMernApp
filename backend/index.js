import express from 'express';
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import { Book } from './models/bookModal.js';
import bookRoutes from './routes/bookRoutes.js';
import cors from 'cors';

const app = express();

// to listen to the port
// anonymos function. Whenever you hit that port run that function
//app.listen(PORT, () => {
// console.log(`App is listening to port: ${PORT}`);
//});

app.use(express.json());  // treat it as json
app.use(cors());

//http response in a numerical code. Whenever people hit the server give the response ("Welcome to backend");
app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send("Welcome to backend");
});

app.use('/books', bookRoutes);  // endpoint, then we need remove books from router
// Route for Save a new Book
// we create a new book
// it is to post our data to database
app.post('/books', async (request, response) => { //we can not run post method in browser. So we need postman App
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear ||
            !request.body.publisher
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            });
        }
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
            publisher: request.body.publisher,
        };
        const book = await Book.create(newBook); // schema we created in a bookModal file

        return response.status(201).send(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// connect with mongoose
mongoose.connect(mongoDBURL)
    //promises
    .then(() => {
        console.log('App connected to the MongoDB database');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

// Route for Get All Books from database
// find the book from the collection 
// in postman GET method and send
// browser understend get method
app.get('/books', async (request, response) => {
    try {
        const books = await Book.find({});
        return response.status(200).json({
            count: books.length,
            data: books,
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});


// Route for Get One Book from database by id
// if you find by id, give response. If not give error
app.get('/books/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const book = await Book.findById(id);
        return response.status(200).json(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// to update book put or patch method
app.put('/books/:id', async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            });
        }
        const { id } = request.params;
        const result = await Book.findByIdAndUpdate(id, request.body); // find the id and update it
        if (!result) {
            return response.status(404).json({ message: 'Book not found' });
        }
        return response.status(200).send({ message: 'Book updated successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});


app.delete('/books/:id', async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            });
        }
        const { id } = request.params;
        const result = await Book.findByIdAndUpdate(id, request.body); // find the id and update it
        if (!result) {
            return response.status(404).json({ message: 'Book not found' });
        }
        return response.status(200).send({ message: 'Book deleted successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});
