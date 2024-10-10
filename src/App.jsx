import { useState } from 'react'
import { NoteCard } from './components/NoteCard'
import { NoteEditor } from './components/NoteEditor'
import Swal from 'sweetalert2'
import { getInitialData } from './utils'

function App() {
  const [notes, setNotes] = useState(getInitialData())
  const [currentMode, setCurrentMode] = useState("unarchived")
  const [searchKeyword, setSearchKeyword] = useState(null)
  const [currentNotes, setCurrentNotes] = useState(notes)
  const [currentNote, setCurrentNote] = useState(null)

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  function insertNote(form) {
    Swal.fire({
      title: "Simpan?",
      showCancelButton: true,
      showCloseButton: true,
    }).then(res => {
      if (res.isConfirmed) {
        const formData = new FormData(form)
        const newNote = {
          id: Date.now(),
          title: formData.get("title"),
          body: formData.get("body"),
          archived: false,
          createdAt: new Date().toISOString()
        }
        setNotes([...notes, newNote])
        setCurrentNote(newNote)
        Toast.fire({
          icon: "success",
          title: "Berhasil menambahkan note baru"
        });
        setCurrentMode("unarchived")
      }
    })
  }

  function updateNote(formData) {
    Swal.fire({
      title: "Simpan?",
      showCancelButton: true,
      showCloseButton: true,
    }).then(res => {
      if (res.isConfirmed) {
        const updatedNotes = notes.map(note => {
          if (note.id === currentNote.id) {
            return {
              ...note,
              title: formData.get("title"),
              body: formData.get("body"),
            };
          }
          return note;
        });
        setNotes(updatedNotes);
        Toast.fire({
          icon: "success",
          title: "Berhasil memperbarui note."
        });
      }
    })
  }

  function setArchived(isArchived, id) {
    Swal.fire({
      title: "Konfirmasi",
      text: `Ingin melakukan ${isArchived ? "archive" : "unarchive"} pada note ini?`,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: "#ffca28"
    }).then(res => {
      if (res.isConfirmed) {
        const updatedNotes = notes.map(note => {
          if (note.id === id) {
            return {
              ...note,
              archived: isArchived,
            };
          }
          return note;
        });
        setNotes(updatedNotes);
        Toast.fire({
          icon: "success",
          title: `Note berhasil ${isArchived ? "archive" : "unarchive"}.`,
        });
      }
    })
  }

  function removeNote(id) {
    Swal.fire({
      icon: "warning",
      title: "Konfirmasi",
      text: "Ingin menghapus catatan ini?",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: "#a91d3a"
    }).then(res => {
      if (res.isConfirmed) {
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
        if (currentNote && currentNote.id === id) {
          setCurrentNote(null);
        }
        Toast.fire({
          icon: "success",
          title: "Note berhasil dihapus.",
        });
      }
    })
  }

  function filteredNotes() {
    let theNotes = notes
    if (searchKeyword) {
      theNotes = theNotes.filter(note => note.title.toLowerCase().includes(searchKeyword.toLowerCase()))
    }
    if (currentMode === "archived") {
      theNotes = theNotes.filter(note => note.archived == true)
    } else {
      theNotes = theNotes.filter(note => note.archived == false)
    }
    return theNotes
  }

  return (
    <>
      <div className='content-wrapper'>
        <div className='left-content'>
          <div className='show-mode'>
            <button onClick={() => setCurrentMode("archived")} className={currentMode === 'archived' ? "active" : ""}>Archived</button>
            <button onClick={() => setCurrentMode("unarchived")} className={currentMode === 'unarchived' ? "active" : ""}>Unarchived</button>
          </div>
          <form className='w-100 p-2 search-bar d-flex'
            onSubmit={ev => {
              ev.preventDefault()
              const formData = new FormData(ev.target)
              setSearchKeyword(formData.get("search").length >= 1 ? formData.get("search") : null)
            }}>
            <input name='search' placeholder="Cari note..." className='flex-grow-1' value={searchKeyword || ''} onChange={ev => {
              setSearchKeyword(ev.target.value)
            }} />
            <button type='submit'>
              <i className="bi bi-search"></i>
            </button>
          </form>
          <div className='notes-container' onClick={() => { setCurrentNote([]) }}>
            {
              filteredNotes().length >= 1 ?
                filteredNotes().map(note => {
                  return (
                    <div className={note.id === currentNote?.id ? 'note-card-wrapper active' : 'note-card-wrapper'} key={note.id}>
                      <div onClick={(e) => {
                        e.stopPropagation()
                        setCurrentNote(note)
                      }}>
                        <NoteCard note={note} />
                      </div>
                      <div className="dropdown">
                        <button className="border-0 bg-transparent dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button className="dropdown-item" onClick={() => setArchived(!note.archived == true, note.id)}>
                              {note.archived ? "Unarchive" : "Archive"}
                            </button>
                          </li>
                          <li><button className="dropdown-item" onClick={() => { removeNote(note.id) }}>Delete</button></li>
                        </ul>
                      </div>
                    </div>
                  )
                }) :
                <p className='text-white text-center'>Catatan Kosong</p>
            }
          </div>
          <button onClick={() => setCurrentNote(null)} className='new-note-btn text-white bg-primary rounded-circle border-0'>
            <i className="bi bi-plus"></i>
          </button>
        </div>

        <form onSubmit={(ev) => {
          ev.preventDefault();
          if (currentNote) {
            updateNote(new FormData(ev.target))
          } else {
            insertNote(ev.target)
          }
        }}>
          {
            currentNote ?
              <NoteEditor note={currentNote} /> :
              <NoteEditor />
          }
        </form>
      </div>
    </>
  )
}

export default App
