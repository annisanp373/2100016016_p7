import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter';
import productRouter from './routes/productRouter';

const app = express();

const uri = "mongodb://localhost:27017/product"; 
mongoose.connect(uri)
  .then(() => {
    console.log('Koneksi ke database berhasil');
  })
  .catch((error) => {
    console.error('Koneksi ke database gagal:', error);
  });

app.use(express.json());

const dbUrl = 'mongodb://localhost:27017/product'; // Ganti dengan URL MongoDB Anda
mongoose.connect(dbUrl)
  .then(() => {
    console.log('Terhubung ke database MongoDB');
  })
  .catch((error) => {
    console.log('Kesalahan saat terhubung ke database:', error);
  });

  app.use('/users', userRouter);
  app.use('/products', productRouter);
  const port = 3000; // Ganti dengan port yang ingin Anda gunakan
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:3000`);
});

