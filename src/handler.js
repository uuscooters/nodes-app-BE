/* eslint-disable max-len */
const { nanoid } = require('nanoid');
const notes = require('./notes');

// Handler Create data Note
const addNoteHandler = (request, h) => {
  // mendapatkan data body request client
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createAt = new Date().toISOString;
  const updateAt = createAt;

  const newNote = {
    title,
    tags,
    body,
    id,
    createAt,
    updateAt,
  };

  notes.push(newNote);

  // menentukan apakah newNote sudah masuk ke dalam array notes berdasarkan Id catatan.
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'Success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// Handler Read all data Note
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

// Handler Read by Id untuk prosess update data note
const getNoteByIdHandler = (request, h) => {
  // untuk mendapatkan nilai Id yg di request client
  const { id } = request.params;
  //   mendapatkan object note dengan Id params tersebut dari object array notes.
  const note = notes.filter((n) => n.id === id)[0];
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Handler edit note by Id
const editNoteByIdHandler = (request, h) => {
  // request params berdasarkan Id note
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updateAt = new Date().toISOString();

  //   memanfatkan indexing array untuk mendapatkan index array pada object notes sesuai Id yg ditentukan
  const index = notes.findIndex((note) => note.id === id);
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updateAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);
  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus, Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler,
};
