import { Request, Response, Router } from 'express';
import ProductModel, { Product } from '../models/Product';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, price, productCategory, thumbnails } = req.body;

    const newProduct: Product = new ProductModel({
      name,
      description,
      price,
      productCategory,
      thumbnails
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat membuat produk baru.', error });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil daftar produk.', error });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil produk.', error });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, description, price, productCategory, thumbnails } = req.body;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { name, description, price, productCategory, thumbnails },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui produk.', error });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndRemove(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    res.json({ message: 'Produk berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus produk.', error });
  }
});

router.get('/owner/:ownerId', async (req: Request, res: Response) => {
  try {
    const ownerId = req.params.ownerId;
    const page = parseInt(req.query.page as string) || 1; // Halaman saat ini
    const limit = parseInt(req.query.limit as string) || 10; // Jumlah produk per halaman

    const skip = (page - 1) * limit;

    const products = await ProductModel.find({ owner: ownerId })
      .skip(skip)
      .limit(limit)
      .exec();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil produk berdasarkan pemilik.', error });
  }
});


export default router;
