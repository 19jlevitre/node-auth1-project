const User = require('.././users/users-model.js')
const bcrypt = require('bcryptjs');
function restricted(req,res, next) {
  if(req.session.user) {
    next()
  } else {
    next({ status: 401, message: "You shall not pass!"})
  }
}

async function checkUsernameFree(req, res, next) {
  
  const { username, } = req.body
  const [user] = await User.findBy({ username })
  if (user) {
    next({ status: 422, message: "Username taken" })
  } else {
    next()
  }

}

async function checkUsernameExists(req, res, next) {
  const { username, password } = req.body
  const [user] = await User.findBy({ username })
  
  if (!user) {
    next({ status: 401, message: "Invalid credentials"})
  }
  else if(!bcrypt.compareSync(password, user.password)){
    next({ status: 401, message: "Invalid credentials"})
  }else {
    next()
  }
}

function checkPasswordLength(req, res, next) {
  const {password} = req.body
  if(!password || password.length < 3) {
    next({status: 422, message: "Password must be longer than 3 chars" })
  }else {
    next()
  }
}

module.exports = {
  restricted,
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
}