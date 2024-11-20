const { Router } = require("express");
const { deleteUser, getUsers, createUser, loginUser, loginSocial, logoutUser, deleteSocial } = require("../controllers/userController");

const router = Router();

router.get("/", getUsers)
router.post("/", createUser)
router.post("/login", loginUser)
router.post("/google", loginSocial) // loginGithub()과 loginGoogle()은 완전 동일하여 loginSocial()으로 대치함. 3개 함수는 완전 동일.
router.post("/github", loginSocial) // loginGithub()과 loginGoogle()은 완전 동일하여 loginSocial()으로 대치함. 3개 함수는 완전 동일.
router.delete("/deleteSocial", deleteSocial)
router.delete("/delete/:id", deleteUser)
router.get("/logout", logoutUser)

module.exports = router