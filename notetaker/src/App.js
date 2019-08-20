import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { createNote, deleteNote, updateNote } from './graphql/mutations';
import { listNotes } from './graphql/queries';
import {
  onCreateNote,
  onDeleteNote,
  onUpdateNote,
} from './graphql/subscriptions';

const App = () => {
  const [id, setId] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  // const getNotes = async () => {
  //   const result = await API.graphql(graphqlOperation(listNotes));
  //   setNotes([...result.data.listNotes.items]);
  // };

  const fetchNotes = async () => {
    const result = await API.graphql(graphqlOperation(listNotes));
    setNotes(result.data.listNotes.items);
  };

  useEffect(() => {
    fetchNotes();

    const createNoteListener = API.graphql(
      graphqlOperation(onCreateNote),
    ).subscribe({
      next: noteData => {
        const newNote = noteData.value.data.onCreateNote;
        setNotes(prevNotes => {
          const oldNotes = prevNotes.filter(note => note.id !== newNote.id);
          const updatedNotes = [...oldNotes, newNote];
          return updatedNotes;
        });
      },
    });

    const deleteNoteListener = API.graphql(
      graphqlOperation(onDeleteNote),
    ).subscribe({
      next: noteData => {
        const deletedNote = noteData.value.data.onDeleteNote;
        setNotes(prevNotes => {
          const updatedNotes = prevNotes.filter(
            note => note.id !== deletedNote.id,
          );
          return updatedNotes;
        });
      },
    });
    const updateNoteListener = API.graphql(
      graphqlOperation(onUpdateNote),
    ).subscribe({
      next: noteData => {
        const updatedNote = noteData.value.data.onUpdateNote;

        setNotes(prevNotes => {
          const index = prevNotes.findIndex(note => note.id === updatedNote.id);
          const updatedNotes = [
            ...prevNotes.slice(0, index),
            updatedNote,
            ...prevNotes.slice(index + 1),
          ];
          return updatedNotes;
        });
        setNote('');
        setId('');
      },
    });

    return () => {
      createNoteListener.unsubscribe();
      deleteNoteListener.unsubscribe();
      updateNoteListener.unsubscribe();
    };
  }, []);

  const handleChangeNote = event => setNote(event.target.value);

  const hasExistingNote = () => {
    if (id) {
      const isNote = notes.findIndex(note => note.id === id) > -1;
      return isNote;
    }
    return false;
  };

  const handleAddNote = async event => {
    event.preventDefault();
    if (hasExistingNote()) {
      handleUpdateNote();
    } else {
      const input = { note };
      // const result =
      await API.graphql(graphqlOperation(createNote, { input }));
      // const newNote = result.data.createNote;
      // setNotes([newNote, ...notes]);
      setNote('');
    }
  };

  const handleUpdateNote = async () => {
    const input = { id, note };
    // const result =
    await API.graphql(graphqlOperation(updateNote, { input }));
    // const updatedNote = result.data.updateNote;
    // const index = notes.findIndex(note => note.id === updatedNote.id);
    // const updatedNotes = [
    //   ...notes.slice(0, index),
    //   updatedNote,
    //   ...notes.slice(index + 1),
    // ];
    // setNotes([...updatedNotes]);
    // setNote('');
    // setId('');
  };

  const handleDeleteNote = async id => {
    const input = { id };
    // const result =
    await API.graphql(graphqlOperation(deleteNote, { input }));
    // const deletedNoteId = result.data.deleteNote.id;
    // const updatedNotes = notes.filter(note => note.id !== deletedNoteId);
    // setNotes([...updatedNotes]);
  };

  const handleSetNote = ({ note, id }) => {
    setNote(note);
    setId(id);
  };
  

  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-1">Amplify Notetaker</h1>
      <form action="" className="mb3" onSubmit={handleAddNote}>
        <input
          type="text"
          className="pa2 f4"
          placeholder="Write your note"
          onChange={handleChangeNote}
          value={note}
        />
        <button className="pa2 f4">{id ? 'Update Note' : 'Add Note'}</button>
      </form>

      <div>
        {notes.map(item => (
          <div key={item.id} className="flex items-center">
            <li className="list pa1 f3" onClick={() => handleSetNote(item)}>
              {item.note}
            </li>
            <button
              className="bg-transparent bn f4"
              onClick={() => handleDeleteNote(item.id)}
            >
              <span>&times;</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuthenticator(App, { includeGreetings: true });
