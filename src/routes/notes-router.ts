import { Router } from "express";
import { getNotesController } from "../controller/notes/get-notes-controller";
import { deleteNoteController } from "../controller/notes/delete-notes-controller";
import { createNoteController } from "../controller/notes/create-notes-controller";
import { updateNotesController } from "../controller/notes/update-notes-controller";

export const notesRouter = Router();

notesRouter.post('/create', createNoteController);   
notesRouter.get('/get-all', getNotesController);
notesRouter.delete('/delete/:id', deleteNoteController);
notesRouter.put('/update/:id', updateNotesController);
