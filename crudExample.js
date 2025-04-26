// crudExample.js
const pool = require('./db');

async function basicCrud() {
  let conn;
  try {
    conn = await pool.getConnection();

    const studentId = 'S10810001';
    const departmentId = 'CS001';

    // 1. 檢查是否已有該學號
    let checkSql = 'SELECT COUNT(*) AS count FROM STUDENT WHERE Student_ID = ?';
    const checkResult = await conn.query(checkSql, [studentId]);
    if (checkResult[0].count > 0) {
      console.log(`學生 ${studentId} 已存在，跳過新增。`);
    } else {
      // 2. INSERT 新增
      let insertSql = 'INSERT INTO STUDENT (Student_ID, Name, Gender, Email, Department_ID) VALUES (?, ?, ?, ?, ?)';
      await conn.query(insertSql, [studentId, '王曉明', 'M', 'wang@example.com', departmentId]);
      console.log('已新增一筆學生資料。');
    }

    // 3. SELECT 查詢
    let selectSql = 'SELECT * FROM STUDENT WHERE Department_ID = ?';
    const students = await conn.query(selectSql, [departmentId]);
    console.log('查詢結果：', students);

    // 4. UPDATE 更新
    let updateSql = 'UPDATE STUDENT SET Name = ? WHERE Student_ID = ?';
    await conn.query(updateSql, ['王小明修改版', studentId]);
    console.log('已更新學生名稱。');

    // 5. DELETE 刪除
    let deleteSql = 'DELETE FROM STUDENT WHERE Student_ID = ?';
    await conn.query(deleteSql, [studentId]);
    console.log('已刪除該學生。');

  } catch (err) {
    console.error('操作失敗：', err);
  } finally {
    if (conn) conn.release();
  }
}

basicCrud();
