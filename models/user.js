const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле email должно быть заполнено'],
    unique: [true, 'Поле email должно быть уникальным'],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Поле email должно быть валидным почтовым адресом',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле пароль должно быть заполнено'],
    select: false,
    minlength: [8, 'Минимальная длина поля пароль - 8'],
  },
  name: {
    type: String,
    required: [true, 'Поле имя должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля имя - 2'],
    maxlength: [30, 'Максимальная длина поля имя - 30'],
  },
});

module.exports = mongoose.model('user', userSchema);
