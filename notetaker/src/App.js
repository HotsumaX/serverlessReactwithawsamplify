import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { createNote, deleteNote } from './graphql/mutations';
import { listNotes } from './graphql/queries';

const App = () => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await API.graphql(graphqlOperation(listNotes));
      setNotes([...result.data.listNotes.items]);
    }
    fetchData();
  }, []);

  const handleChangeNote = event => setNote(event.target.value);

  const handleAddNote = async event => {
    event.preventDefault();
    const input = { note };
    const result = await API.graphql(graphqlOperation(createNote, { input }));
    const newNote = result.data.createNote;
    setNotes([newNote, ...notes]);
    setNote('');
  };

  const handleDeleteNote = async id => {
    const input = { id };
    const result = await API.graphql(graphqlOperation(deleteNote, { input }));
    const deletedNoteId = result.data.deleteNote.id;
    const updatedNotes = notes.filter(note => note.id !== deletedNoteId);
    setNotes([...updatedNotes]);
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
        <button className="pa2 f4">Add Note</button>
      </form>

      <div>
        {notes.map(item => (
          <div key={item.id} className="flex items-center">
            <li className="list pa1 f3">{item.note}</li>
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
