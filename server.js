require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const userRouter = require('./routers/user');
const categoryRouter = require('./routers/caregory');
const upRouter = require('./routers/upload');
const productRouter = require('./routers/product');
const paymentRouter = require('./routers/payment');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

const url = process.env.MONGO_URL;
mongoose.connect(
  url,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log('Connected to MongoDB');
  }
);

app.use('/user', userRouter);
app.use('/api', categoryRouter);
app.use('/api', upRouter);
app.use('/api', productRouter);
app.use('/api', paymentRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(process.env.PORT || 5000, function () {
  console.log(
    'Express server listening on port %d in %s mode',
    this.address().port,
    app.settings.env
  );
});
