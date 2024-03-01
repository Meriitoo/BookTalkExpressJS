const router = require('express').Router();
const { isAuth } = require('../middlewares/authMiddleware');
const userService = require('../services/userService');

router.get('/', (req, res) => {
    console.log(req.user)
    res.render('home');
});

router.get('/authorize-test', isAuth, (req, res) => {
    res.send('You are authorized');
});

router.get('/profile', isAuth, async (req, res) => {
    const userId = req.user._id;
    let wished = await userService.getMyWishBook(userId);
    res.render('home/profile', { wished });
});

module.exports = router;