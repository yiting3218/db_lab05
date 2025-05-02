// transactionExample.js
const pool = require('./db');

// 從命令列取得參數
const studentId = process.argv[2];
const newDeptId = process.argv[3];

if (!studentId || !newDeptId) {
  console.log('請提供學號與新系所');
  process.exit(1);
}

async function doTransaction(studentId, newDeptId) {
  let conn;
  try {
    conn = await pool.getConnection();

    // 檢查學生是否存在
    const checkResult = await conn.query(
      'SELECT * FROM STUDENT WHERE Student_ID = ?',
      [studentId]
    );

    if (checkResult.length === 0) {
      console.log(`找不到學號 ${studentId}，無法進行轉系作業`);
      return;
    }

    await conn.beginTransaction(); // 開始交易
    console.log(`學號 ${studentId} 存在，開始執行轉系...`);

    // 只更新 STUDENT 的系所
    const updateStudent = 'UPDATE STUDENT SET Department_ID = ? WHERE Student_ID = ?';
    await conn.query(updateStudent, [newDeptId, studentId]);

    await conn.commit(); // 提交交易
    console.log(`轉系成功，已更新為 ${newDeptId}`);

    // 查詢目前系所
    const result = await conn.query(
      'SELECT Department_ID FROM STUDENT WHERE Student_ID = ?',
      [studentId]
    );
    console.log(`目前系所為：${result[0].Department_ID}`);
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('發生錯誤，已回滾：', err);
  } finally {
    if (conn) conn.release();
  }
}

doTransaction(studentId, newDeptId);
