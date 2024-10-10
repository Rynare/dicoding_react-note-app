import { showFormattedDate } from "../utils";

export function NoteCard({ note }) {
    const date = new Date(note.createdAt);
    return (
        <div className="d-flex flex-column px-1">
            <p className="m-0 fw-bold text-truncate">{note.title}</p>
            <p className="text-truncate">{note.body}</p>
            <p className="ms-auto m-0 text-secondary">{showFormattedDate(note.createdAt)}</p>
        </div>
    )
}