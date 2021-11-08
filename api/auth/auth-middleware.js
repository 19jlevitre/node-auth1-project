const User = require('.././users/users-model.js')

function restricted(req,res, next) {
  if(req.sessions.user) {
    next()
  } else {
    next({ status: 401, message: "You shall not pass!"})
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  
  const { username, password } = req.body
  const [user] = await User.findBy({ username })
  if (user) { // TEST THIS
    return next({ status: 422, message: "Username taken" })
  } else {
    next()
  }

}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  const { username, password } = req.body
  const [user] = await User.findBy({ username })

  if (!user) {
    return next({ status: 401, message: "Invalid credentials"})
  }
  

}

function checkPasswordLength(req, res, next) {
  const {username, password} = req.body
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