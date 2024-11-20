const {Router} = require("express");
const { getRooms, getRoom, createRoom, updateRoom, deleteRoom } = require("../controllers/roomController");
const { auth } = require("../middleware/authMiddleware");

const router = Router();

//아래 5개 함수는 login 상태에서만 사용가능
//logout상태에서 진행하면 "no token" 메세지를 출력
router.get("/", getRooms)
router.get("/:id", getRoom)
router.post("/", auth, createRoom)
router.put("/:id", auth, updateRoom)
router.delete("/:id", auth, deleteRoom)

module.exports = router