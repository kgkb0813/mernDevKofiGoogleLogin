const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Firebase Admin 인증 키 파일

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Firebase Admin Auth 객체 내보내기
module.exports = {
  adminAuth: admin.auth(),
};
