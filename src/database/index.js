var mysql = require("mysql");
var nodemailer = require("nodemailer");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "assalamualaikum",
  database: "jc10_finalproject",
  port: 3307
});

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bondanrp@gmail.com",
    pass: "ynhefgogglxqplcn"
  }
});

module.exports = db;

module.exports = {
  verifyAccount: (req, res) => {
    let to = req.query.email;
    let username = req.query.username;
    let mailOptions = {
      from: '"Purwadhika JC10" <bondanrp@gmail.com>',
      to,
      subject: "Verify Your Account",
      html: `<p>Please <a href='http://localhost:3001/verify?username=${username}'>click here</a> to verify your account.</p>`
    };
    if (to) {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        res.send("Email Berhasil");
      });
    } else {
      res.send("Email kosong!");
    }
  },

  verify: (req, res) => {
    let username = req.query.username;
    db.query(
      `update users set ferified = 1 where username = '${username}'`,
      (err, res) => {
        if (err) throw err;
        res.send("Account Verified");
      }
    );
  },

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
  getTeacher: (req, res) => {
    db.query(
      `select * from users where role = 'teacher' order by rand()`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  registerUser: (req, res) => {
    db.query(
      `insert into users values (0,'${req.body.username}','${req.body.email}','${req.body.password}', 'user','${req.body.firstname}','${req.body.lastname}','https://www.thispersondoesnotexist.com/image')`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },

  getVideos: (req, res) => {
    db.query(
      `SELECT *
      FROM
        (SELECT id, title, episode, thumbnail, video, description, author, category, 
                     @category_rank := IF(@current_category = category, @category_rank + 1, 1) AS category_rank,
                     @current_category := category 
          FROM uploads
          ORDER BY category
        ) ranked
      WHERE category_rank <= 2 limit 10 ;`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
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
      `select * from uploads where author = '${req.query.username}' order by id desc`,
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
  },
  getCategories: (req, res) => {
    db.query(
      `select category from uploads group by category limit 6`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  getPreview: (req, res) => {
    db.query(
      `select * from uploads where category = '${req.query.category}' order by id desc limit 10`,
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
