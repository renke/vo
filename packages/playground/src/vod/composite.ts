import { v } from "@renke/vod";
import * as zod from "zod";

export type Title = zod.infer<typeof Title>;
export const Title = v("Title", zod.string().min(1).max(30));

export type BookId = zod.infer<typeof BookId>;
export const BookId = v("BookId", zod.string());

export type Author = zod.infer<typeof Author>;
export const Author = v("Author", zod.string());

export const Book = v(
  "Book",
  zod.object({
    id: BookId,
    title: Title,
    author: Author,
  })
);

export type Book = zod.infer<typeof Book>;

export const changeTitle = (newName: Title, b: Book): Book => {
  return Book.create({ ...b, title: newName });
};

export const changeAuthor = (newAuthor: Author, b: Book): Book => {
  return Book.create({ ...b, author: newAuthor });
};

export const saveBook = (b: Book) => {
  b.id;
};
