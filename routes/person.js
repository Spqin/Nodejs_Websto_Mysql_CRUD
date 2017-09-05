var express = require('express');
var router = express.Router();
//引入数据库包
var db = require("./db.js");

/* GET  listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

/**
 * 查询列表页
 */
router.get('/', function (req, res, next) {
    db.query('select * from person', function (err, rows) {
        console.log(rows);
        if (err) {
            res.render('persons', {title: '人员管理', datas: []});  // this renders "views/persons.html"
        } else {

            res.render('persons', {title: '人员管理', datas: rows});
        }
    })
});
/**
 * 新增页面跳转
 */

router.get('/add', function (req, res) {
    res.render('add');
});
router.post('/add', function (req, res) {
    var name = req.body.name;
    var age = req.body.age;
    var professional = req.body.professional;
    db.query("insert into person(name,age,professional) values('" + name + "'," + age + ",'" + professional + "')", function (err, rows) {
        if (err) {
            res.end('新增失败：' + err);
        } else {
            res.redirect('/persons');
        }
    })
});

/**
 * 删
 */
router.get('/del/:id', function (req, res) {
    var id = req.params.id;
    db.query("delete from person where id=" + id, function (err, rows) {
        if (err) {
            res.end('删除失败：' + err)
        } else {
            res.redirect('/persons')
        }
    });
});
/**
 * 修改
 */
router.get('/toUpdate/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    db.query("select * from person where id=" + id, function (err, rows) {
        if (err) {
            res.end('修改页面跳转失败：' + err);
        } else {
            res.render("update", {datas: rows});       //直接跳转
        }
    });
});
router.post('/update', function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var age = req.body.age;
    var professional = req.body.professional;
    db.query("update person set name='" + name + "',age='" + age + "',professional= '" + professional + "' where id=" + id, function (err, rows) {
        if (err) {
            res.end('修改失败：' + err);
        } else {
            res.redirect('/persons');
        }
    });
});
/**
 * 查询
 */
router.post('/search', function (req, res) {
    var name = req.body.s_name;
    var age = req.body.s_age;
    var professional = req.body.s_professional;

    var sql = "select * from person";

    if (name) {
        sql += " and name like '%" + name + "%' ";
    }
    if (age) {

        sql += " and age=" + age + " ";
    }
    if (professional) {
        sql += " and name like '%" + professional + "%' ";
    }
    sql = sql.replace("and","where");
    db.query(sql, function (err, rows) {
        if (err) {
            res.end("查询失败：", err)
        } else {
            res.render("persons", {title: '人员管理', datas: rows, s_name: name, s_age: age});
        }
    });
});


module.exports = router;