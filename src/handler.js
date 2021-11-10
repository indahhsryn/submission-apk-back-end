const { nanoid } = require("nanoid");
const books = require("./books");

//kriteria 1: Api dapat menyimpan buku
const addBooksHandler = (request, h) => {
    const{ name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBooks = {
      id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };

        // jika client tidak menampilkan properti name pada request body
        if(!name){
            const response = h.response({
                status: 'fail',
                message: "Gagal menambahkan buku. Mohon isi nama buku"
            })
            response.code(400);
            return response;
        }
        
        //client melampirkan properti readPage yang lebih besar dari nilai properti pageCount
        if(readPage > pageCount){
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
            })
            response.code(400);
            return response;
        }
    
        books.push(newBooks); //untuk memasukan nilai nilai array menggunakan method push
        
    const isSuccess = books.filter((books) => books.id === id).length > 0;
     //isSuccess untuk menentukan respons yang diberikan user


//jika buku berhasil dimasukkan ke server
    if(isSuccess){
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data:{
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    //jika server gagal memasukkan buku karena alasan umum
    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

//kriteria 2: Api dapat menampilkan seluruh buku 
const getAllBooksHandler = () => ({
    status: 'success',
    data:{
        books:books.map((book)=> ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        })),
    }});


//kriteria:3 Api dapat menampilkan detail buku 
const getBooksByIdHandler = (request, h) => {
    const{ bookId } = request.params;

    const book = books.filter((n)=> n.id === bookId)[0] //menemukan buku berdasarkan id
    
    //bila buku dengan id yang dilampirkan ditemukan 
    if(book !== undefined){
       return{
           status: 'success',
           data:{
               book,
           }
       }
    }

    //bila buku dengan id yang dilampirkan oleh client tidak ditemukan
    const response = h.response({
        status:'fail',
        message:'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

//kriteria 4: Api dapat mengubah data buku
const editBooksByIdHandler = (request, h) =>{
    const {bookId} = request.params;

    const{ name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

   if(name === undefined){
       const response = h.response({
           status: 'fail',
           message: 'Gagal memperbarui buku. Mohon isi nama buku',
       });

       response.code(400);
       return response;
   }
     //client melampirkan nilai property readPage > pageCount
    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
 
    const index = books.findIndex((book) => book.id === bookId);

    if(index !== -1){
    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        updatedAt,
    };
        //bila buku berhasil diperbarui
        const response = h.response({
            status: 'success',
            message:'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
 
//kriteria 5: Api dapat menghapus buku
const deleteBooksByIdHandler = (request, h) =>{
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id ===  bookId);

    //bila id dimiliki oleh salah satu buku
    if(index !== -1){
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    //bila id yang dilampirkan tidak dimiliki oleh buku manapun
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBooksHandler, 
    getAllBooksHandler,
    getBooksByIdHandler,
    editBooksByIdHandler,
    deleteBooksByIdHandler
    };