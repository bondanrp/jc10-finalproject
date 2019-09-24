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

      res.send(hasil);
    });
  },
  login: (req, res) => {
    db.query(
      `select * from users where username = '${req.query.username}'`,
      (err, result) => {
        if (err) throw err;
        if (!result.length) {
          let hasil = { status: "404", message: "User Not Found" };
          res.send(hasil);
        } else if (req.query.password !== result[0].password) {
          let hasil = {
            status: "401",
            message: "Wrong Password"
          };
          res.send(hasil);
        } else if (req.query.password === result[0].password) {
          let hasil = {
            status: "200",
            result
          };
          res.send(hasil);
        }
      }
    );
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
  },
  getRelatedVideos: (req, res) => {
    db.query(
      `select * from uploads where category='${req.query.category}' order by RAND() limit 10`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  getVideo: (req, res) => {
    db.query(
      `select * from uploads where id = ${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  getEpisode: (req, res) => {
    db.query(
      `select * from uploads where title = '${req.query.title}' and episode = '${req.query.episode}'`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  getUserVideos: (req, res) => {
    db.query(
      `select * from uploads where author = '${req.query.author}'`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },

  uploadVideo: (req, res) => {
    db.query(
      `insert into uploads values (0,'${req.body.title}','${req.body.episode}','${req.body.thumbnail}', '${req.body.video}','${req.body.description}','${req.body.author}','${req.body.category}')`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
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
