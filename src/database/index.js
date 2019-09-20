var mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "assalamualaikum",
  database: "jc10_finalproject",
  port: 3307
});

module.exports = db;

module.exports = {
  getAllUserData: (req, res) => {
    db.query(`select * from users`, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  },
  getUserName: (req, res) => {
    db.query(
      `select * from users where username = '${req.query.username}'`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  getUser: (req, res) => {
    db.query(
      `select * from users where username = '${req.query.username}' and password = '${req.query.password}'`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  getUserEmail: (req, res) => {
    db.query(
      `select * from users where email = '${req.query.email}'`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },

  registerUser: (req, res) => {
    console.log(req);
    db.query(
      `insert into users values (0,'${req.body.username}','${req.body.email}','${req.body.password}', 'user','${req.body.firstname}','${req.body.lastname}')`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },

  getVideos: (req, res) => {
    db.query(`select * from uploads`, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  }
};

// CLOSING EXPORT

//   editTodo: (req, res) => {
//     db.query(
//       `update todo set action = '${req.body.action}' where id = ${req.body.id}`,
//       (err, result) => {
//         if (err) throw err;
//         res.send("Update Success!");
//       }
//     );
//   },

//   kochengOren: (req, res) => {
//     db.query(
//       `update todo set isCompleted = 1 where id = ${req.body.id}`,
//       (err, result) => {
//         if (err) throw err;
//         res.send("Update Success!");
//       }
//     );
//   },

//   deleteTodo: (req, res) => {
//     var id = req.params.terserah;
//     db.query(`delete from todo where id = ${id}`, (err, result) => {
//       if (err) throw err;
//       res.send(result);
//     });
//   }
// };
