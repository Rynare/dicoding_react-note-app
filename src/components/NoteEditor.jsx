import { useState, useEffect } from 'react';

export function NoteEditor({ note }) {
    const [title, setTitle] = useState(note?.title || "");
    const [body, setBody] = useState(note?.body || "");
    const [remainingChars, setRemainingChars] = useState(50 - (note?.title?.length || 0));

    useEffect(() => {
        setTitle(note?.title || "");
        setBody(note?.body || "");
        setRemainingChars(50 - (note?.title?.length || 0));
    }, [note]);

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        if (newTitle.length <= 50) {
            setTitle(newTitle);
            setRemainingChars(50 - newTitle.length);
        }
    };

    return (
        <div className="note-editor">
            <div className='w-100 position-relative d-flex title-wrapper align-items-center'>
                <input
                    required
                    className='w-100'
                    type="text"
                    placeholder="Masukkan judul..."
                    value={title}
                    onChange={handleTitleChange}
                    name="title"
                />
                <div className='position-absolute remaining-char d-flex align-items-center justify-content-center'>
                    {remainingChars}/50
                </div>
            </div>

            <textarea
                required
                placeholder="Ketik disini..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                name="body"
            ></textarea>

            <button type='submit' className='save-note-btn bg-success rounded-2 p-2 text-white'>
                <i className="bi bi-floppy-fill"></i>
            </button>
        </div>
    )
}
