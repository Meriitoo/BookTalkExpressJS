const router = require('express').Router();
const mongoose = require('mongoose');

const authService = require('../services/authService');
const bookService = require('../services/bookService');
const { isAuth, isGuest } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorUtils');


router.get('/catalog', async (req, res) => {
   const book = await bookService.getAll();

   res.render('book/catalog', { book });
   // res.render('course/catalog', { course: []}); //for testin if no courses
});

router.get('/create', isAuth, (req, res) => {
   res.render('book/create');
});

router.post('/create', isAuth, async (req, res) => {
   const bookData = req.body;

   try {
      await bookService.create(req.user._id, bookData);
      res.redirect('/book/catalog');
   } catch (error) {
      return res.status(400).render('book/create', { ...bookData, error: getErrorMessage(error), bookData: bookData });
   }

});


router.get('/:bookId/details', async (req, res) => {
   const book = await bookService.getOne(req.params.bookId);

   const isOwner = book.owner == req.user?._id;
   const bookOwner = await bookService.findOwner(book.owner).lean();

   const isWishToRead = book.wishingLis?.some(user => user._id == req.user?._id);

   res.render('book/details', { ...book, isOwner, isWishToRead, bookOwner });
});

router.get('/:bookId/wish-to-read', isAuth, async (req, res) => {
   try {
      await bookService.wishToReadFunc(req.user._id, req.params.bookId);
   } catch (error) {
      return res.status(400).render('404', { error: getErrorMessage(error) });
   }

   res.redirect(`/book/${req.params.bookId}/details`);
});

router.get('/:bookId/edit', isAuth, isCourseOwner, async (req, res) => {
   const book = await bookService.getOne(req.params.bookId);

   res.render('book/edit', { ...book });
});

router.post('/:bookId/edit', isAuth, isCourseOwner, async (req, res) => {
   const bookData = req.body;

   try {
      await bookService.edit(req.params.bookId, bookData);
      res.redirect(`/book/${req.params.bookId}/details`);

   } catch (error) {
      return res.render('book/edit', { ...bookData, error: getErrorMessage(error)});
   };

});

async function isCourseOwner(req, res, next) {
   const book = await bookService.getOne(req.params.bookId);

   if (book.owner != req.user?._id) {
      return res.redirect(`/book/${req.params.bookId}/details`);
   }

   next();
}


router.get('/:bookId/delete', isAuth, isCourseOwner, async (req, res) => {

   await bookService.delete(req.params.bookId);
   res.redirect('/book/catalog')
});






module.exports = router;