import mongoose from 'mongoose';

const bookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        publishYear: {
            type: Number,
            required: true,
        },
        publisher: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

// book collection consists of 3 columns
export const Book = mongoose.model('Book', bookSchema);