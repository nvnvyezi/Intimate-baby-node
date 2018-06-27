const express = require('express');
const mysql = require('../mysql/mysql');

const router = express.Router();

router.get('/', (req, res) => {
	let id = req.query.id || 'nvnvyezi';
  if (id) {
		mysql.findSql(id, (flag, data) => {
			if (!flag && data.length !== 0) {
				// console.log(data[0])
				delete data[0].password;
				let result = {
					err: false,
					result: data[0]
				};
				res.json(result);
				res.end();
			} else {
				let result = {
					err: true,
					data: '没有找到',
					result: ''
				};
				res.json(result);
				res.end();
			}
		})
	} else {
		let result = {
			err: true,
			data: '参数错误',
			result: ''
		};
		res.json(result);
		res.end();
	}
})

router.post('/', (req, res) => {
	let id = req.body.id;
	let bookShelf = req.body.bookShelf;
  if (id && bookShelf) {
		mysql.findSql(id, (flag, data) => {
			if (!flag && data.length !== 0) {
				mysql.updateSql({id, bookShelf}, (flag, data) => {
					if (!flag) {
						let result = {
							err: false,
							data: '成功'
						};
						res.json(result);
						res.end();
					} else {
						let result = {
							err: true,
							data: '修改错误'
						};
						res.json(result);
						res.end();
					}
				})
			} else {
				let result = {
					err: true,
					data: '没有找到',
					result: ''
				};
				res.json(result);
				res.end();
			}
		})
	} else {
		let result = {
			err: true,
			data: '参数错误',
			result: ''
		};
		res.json(result);
		res.end();
	}
})

module.exports = router;
