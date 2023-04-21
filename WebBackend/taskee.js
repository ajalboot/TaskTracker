const db = require("./db");

const findAll = async () => {
  const result = await db.query("select * from taskee");
  return result;
};

const findOne = async (id) => {
  const result = await db.query(`select * from taskee where id = ${id}`);
  return result.pop();
};

const createUpdate = async (data) => {
  let result;
  if (!data.id) {
    result = await db.query(
      `INSERT INTO freedb_taskee.taskee (createdAt, task, addressData) 
        VALUES(CURRENT_TIMESTAMP, :task, null);`,
      data
    );
  } else {
    const toBeUpdated = await findOne(data.id);
    addressData: JSON.stringify(toBeUpdated.addressData),

    result = await db.query(
      `UPDATE freedb_taskee.taskee
          SET 
            updatedAt=CURRENT_TIMESTAMP, 
            completed=:completed, 
            task=:task, 
            addressData=:addressData
          WHERE id=:id and completed !=1;`,
        {
        ...toBeUpdated,
        addressData: JSON.stringify(toBeUpdated.addressData),
        ...data,
      },
    );
  }
  const id = data.id || parseInt(result.insertId);
  return findOne(id);
};

const remove = async (id) => {
  await db
    .query(`DELETE FROM freedb_taskee.taskee WHERE id= :id;`, { id })
    .then((res) => {
      return !!res.affectedRows;
    });
};

module.exports = { findAll, findOne, createUpdate, remove };
