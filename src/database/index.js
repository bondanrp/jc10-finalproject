var mysql = require("mysql");
var nodemailer = require("nodemailer");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "assalamualaikum",
  database: "jc10_finalproject"
});
// contoh hosting database
// const db = mysql.createConnection({
//   host: "db4free.net",
//   user: "bondanrp",
//   password: "assalamualaikum",
//   database: "jc10finalproject"
// });

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bondanrp@gmail.com",
    pass: "ynhefgogglxqplcn"
  }
});

module.exports = db;

module.exports = {
  verify: (req, res) => {
    let username = req.query.username;
    db.query(
      `update users set verified = 1 where username = '${username}'`,
      (err, res) => {
        if (err) throw err;
        res.send("Account Verified");
      }
    );
  },
  updateDP: (req, res) => {
    let username = req.body.username;
    let picture = req.body.profilepict;
    db.query(
      `update users set profilepict = '${picture}' where username = '${username}'`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },

  getAllUserData: (req, res) => {
    db.query(`select * from users`, (err, result) => {
      if (err) throw err;
      res.send(result);
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
      `select p.profilepict, p.firstname,p.lastname,p.username, p.role,f.category from users p join uploads f on p.username=f.author group by p.username order by rand()`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  registerUser: (req, res) => {
    db.query(
      `select * from users where username = '${req.body.username}' or email = '${req.body.email}'`,
      (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          res.send({
            status: "400",
            message: "Username or email have already been registered"
          });
        } else {
          db.query(
            `insert into users values (0,'${req.body.username}','${req.body.email}','${req.body.password}', 'user','${req.body.firstname}','${req.body.lastname}','https://www.thispersondoesnotexist.com/image')`,
            (err2, result) => {
              if (err2) throw err2;
              let mailOptions = {
                from: '"Bagi Bakat" <bondanrp@gmail.com>',
                to: req.body.email,
                subject: "Verify Your Account",
                html: `<p>Please <a href='http://localhost:3001/verify?username=${req.body.username}'>click here</a> to verify your account.</p>`
              };
              transporter.sendMail(mailOptions, (err3, info) => {
                if (err3) throw err3;
              });
              res.send({
                status: "201",
                message:
                  "Your account has been created, please check your email to verify your account!"
              });
            }
          );
        }
      }
    );
  },

  getVideos: (req, res) => {
    db.query(
      `SELECT *
      FROM
        (SELECT id, title, class, episode, thumbnail, video, description, author, category, views, timestamp,
                     @category_rank := IF(@current_category = category, @category_rank + 1, 1) AS category_rank,
                     @current_category := category 
          FROM uploads
          ORDER BY category
        ) ranked
      WHERE category_rank <= 2 order by views desc limit 10;`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  browseAll: (req, res) => {
    db.query(`SELECT * FROM uploads order by timestamp desc`, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  },
  getRelatedVideos: (req, res) => {
    db.query(
      `select * from uploads where class='${req.query.class}'`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  search: (req, res) => {
    db.query(
      `select * from uploads where title like '%${req.query.search}%' or class like '%${req.query.search}%'
      or description like '%${req.query.search}%' or author like '%${req.query.search}%' or category like '%${req.query.search}%' order by views`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  searchTeachers: (req, res) => {
    db.query(
      `select username, profilepict, firstname, lastname, role from users 
      where username like '%${req.query.search}%' or firstname like '%${req.query.search}%' or lastname like '%${req.query.search}%'`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  getFeaturedVideos: (req, res) => {
    db.query(
      `select * from uploads where episode = 1 order by RAND() limit 9`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  getVideo: (req, res) => {
    db.query(
      `select j.*, f.id as posterid from uploads j join users f on j.author = f.username where j.episode = ${req.params.episode} and j.class = '${req.params.class}' and j.author='${req.params.author}'`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  getEpisode: (req, res) => {
    db.query(
      `select title, episode, id from uploads where class = '${req.query.class}' and episode = '${req.query.episode}'`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  getUserVideos: (req, res) => {
    db.query(
      `select * from uploads where author = '${req.query.username}' order by timestamp`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  getComments: (req, res) => {
    db.query(
      `select j.id,f.id as video_id, f.title,p.role, p.profilepict, p.username, j.comment, j.timestamp 
      from comments j join users p on p.id = j.user_id join uploads f on f.id = j.video_id where j.video_id = '${req.query.id}' order by timestamp desc`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  postComment: (req, res) => {
    db.query(
      `insert into comments values (0,'${req.body.videoid}','${req.body.userid}','${req.body.comment}',CURRENT_TIMESTAMP)`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  sendCommentNotification: (req, res) => {
    let link = req.headers.referer.replace("http://localhost:3000/", "");
    db.query(
      `insert into notifications values(0,'${req.body.targetid}','${link}','@${req.body.username} just commented on ${req.body.episode}. ${req.body.title}  "${req.body.comment}"', CURRENT_TIMESTAMP)`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  getNotifications: (req, res) => {
    db.query(
      `select * from notifications where user_id = '${req.params.id}' order by timestamp desc limit 5`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  deleteNotification: (req, res) => {
    db.query(
      `delete from notifications where id = '${req.params.id}'`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  deleteComment: (req, res) => {
    db.query(
      `delete from comments where id = '${req.params.id}'`,
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
      `select category from uploads group by category`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  getPreview: (req, res) => {
    db.query(
      `select * from uploads where category = '${req.query.category}' order by id desc`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  getSubscription: (req, res) => {
    db.query(
      `SELECT p.id, f.username, j.* FROM users p INNER JOIN subscription pf ON pf.user_id = p.id INNER JOIN users f ON f.id = pf.subscribe_id inner join uploads j on f.username = j.author where p.id = '${req.params.id}' order by j.id desc`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  countSubscribers: (req, res) => {
    db.query(
      `select count(user_id) as subscribers,subscribe_id from subscription where subscribe_id='${req.params.id}'`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  isSubscribed: (req, res) => {
    db.query(
      `SELECT user_id as userid, subscribe_id as targetid FROM subscription where user_id = '${req.query.userid}' and subscribe_id = '${req.query.targetid}'`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  subscribedTeachers: (req, res) => {
    db.query(
      `SELECT f.username, f.profilepict
      FROM users p
      INNER JOIN subscription pf
      ON pf.user_id = p.id
      INNER JOIN users f
      ON f.id = pf.subscribe_id
      where p.username = '${req.query.username}'`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  subscribe: (req, res) => {
    db.query(
      `insert into subscription values ('${req.body.userid}','${req.body.targetid}')`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
  unsubscribe: (req, res) => {
    db.query(
      `delete from subscription where user_id = '${req.params.userid}' and subscribe_id = '${req.params.targetid}'`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },

  view: (req, res) => {
    db.query(
      `update uploads set views = views+1 where id = '${req.body.id}'`,
      (err, result) => {
        if (err) throw err;
        res.send("Update Success!");
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
