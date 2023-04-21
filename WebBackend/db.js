const mysql2 = require("mysql2/promise");
const path = require("path");
const fs = require("fs-extra");

process.on("SIGINT", () => {
  close();
  process.exit();
});
process.on("exit", () => {
  close();
  process.exit();
});

// Set query timeout in milliseconds
const timeout = 15000;

// Global
let pool = null;
let poll = null;

function connect(args, usePolling = false) {
  pool = mysql2.createPool({
    multipleStatements: true,
    typeCast: typeCast,
    dateStrings: true,
    namedPlaceholders: true,
    enableKeepAlive: true,
    ...args,
  });
  pool.on("connection", (conn) => {
    // conn.query("SET GLOBAL time_zone = 'SYSTEM'");
  });
  if (usePolling) {
    clearTimeout(poll);
    poll = setInterval(async () => {
      await query("SELECT 1");
    }, timeout);
  }
}

function typeCast(field, next) {
  if (field.name === "blob") {
    // Must name column "blob" for buffers. This is because the JSON and TEXT column
    // type is alias for BLOB in mariaDB.
    return next();
  }

  if (field.type === "TINY" && field.length === 1) {
    return field.string() === "1"; // Treat TINYINT(1) fields as booleans
  }
  if (field.type === "DATETIME" || field.type === "TIMESTAMP") {
    return new Date(field.string()); // Convert MySQL date/time fields to JavaScript Date objects
  }
  if (field.type === "DECIMAL" || field.type === "NEWDECIMAL") {
    return parseFloat(field.string()); // Convert DECIMAL and NEWDECIMAL fields to numbers
  }
  if (
    field.type === "TINYBLOB" ||
    field.type === "MEDIUMBLOB" ||
    field.type === "LONGBLOB" ||
    field.type === "BLOB"
  ) {
    return JSON.parse(field.string()); // Convert JSON and BLOB fields to objects
  }
  if (field.type === "JSON") {
    return JSON.parse(field.string("utf8")); // Convert JSON and BLOB fields to objects
  }
  return next();
}

function query(sql, values = {}) {
  let row;
  try {
    row = pool.query({ sql, values }).then((result) => result[0]);
    console.log(`Query succeeded: ${sql}`);
    return row;
  } catch (err) {
    console.error(`Query failed: ${sql}`);
    console.error(err);
  }
}

const tables = ["taskee"];

async function setup() {
  const tablesInDatabase = await getTables();
  let sql = "";
  for (let table of tables) {
    if (!tablesInDatabase.includes(table.toLowerCase())) {
      const filePath = path.join(__dirname, `./tables/${table}.sql`);
      sql += await fs.readFile(filePath);
      sql += "\n";
    }
  }

  const chunks = sql.replace(/;;/g, "").split(/^delimiter.*/im);
  for (let chunk of chunks) {
    if (chunk.trim()) {
      await pool.query(chunk);
    }
  }
}

async function getTables() {
  const [rows] = await pool.query("SHOW TABLES");
  return rows.map((row) => Object.values(row).pop());
}

function close() {
  pool.end();
}

module.exports = {
  connect,
  query,
  setup,
  getTables,
  close,
};
