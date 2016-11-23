import projectHandlers from '../handlers/project_handlers.js';
// 登录校验
//import { checkLogin } from '../middleware';

export default function(app) {
  // 添加项目模板
  app.get('/api/projects/new', /* checkLogin, */ (req, res) => {
    res.send('添加项目模板'); // 测试
    // res.direct();
  });
  // 获取项目列表
  app.get('/api/projects/list', (req, res) => {
    //const uid = 111; //测试用
    let projectTotal = 0;
    const query = {};
    projectHandlers.getCount(query)
      .then((result) => {
        projectTotal = result;
      })
      .catch(err => {
        if (err) throw new Error(err);
      })
    //分页
    const sortKey = req.body.sort_key || "creat_time";
    const pageNum = req.body.page_num || 1
    const pageSize = req.body.page_size || 12;
    const pageTotal = Math.floor(projectTotal / pageSize) + 1;
    const Page = {
      skip: (pageNum - 1) * pageSize,
      limit: pageSize,
      sort: { sortKey: -1 }
    }
    const op = {
      create_time: 1,
      _id: 1,
      project_name: 1,
      star_count: 1
    }
    projectHandlers.getList(query, op, Page)
      .then((result) => {
        res.json({
          status: 0,
          msg: '获取项目列表',
          page_num: pageNum,
          page_size: pageSize,
          page_total: pageTotal,
          projects_total: projectTotal,
          data: result
        });
      })
  });
  // 获取我发布的项目
  app.get('/api/projects/release', /* checkLogin, */ (req, res) => {
    const uid = 112; //测试用
    let projectTotal = 0;
    const query = { uid: uid };
    projectHandlers.getCount(query)
      .then((result) => {
        if (result) {
          projectTotal = result;
        } else {
          return res.json({ status: 0, msg: "没有项目", data: [] })
        }

      })
      .catch(err => {
        if (err) throw new Error(err);
      })
      //分页
    const sortKey = req.body.sort_key || "creat_time";
    const pageNum = req.body.page_num || 1
    const pageSize = req.body.page_size || 12;
    const pageTotal = Math.floor(projectTotal / pageSize) + 1;
    const Page = {
      skip: (pageNum - 1) * pageSize,
      limit: pageSize,
      sort: { sortKey: -1 }
    }
    const op = {
      create_time: 1,
      _id: 1,
      project_name: 1,
      star_count: 1
    }
    projectHandlers.getList(query, op, Page)
      .then((result) => {
        res.json({
          status: 0,
          msg: '获取我发布的项目',
          page_num: pageNum,
          page_size: pageSize,
          page_total: pageTotal,
          projects_total: projectTotal,
          data: result
        });
      })
  });
  // 获取我开发的项目
  app.get('/api/projects/development', /* checkLogin, */ (req, res) => {
    const uid = 111; //测试用
    let projectTotal = 0;
    const query = {};
    projectHandlers.getCount(query)
      .then((result) => {
        projectTotal = result;
      })
      .catch(err => {
        if (err) throw new Error(err);
      })
      //分页
    const sortKey = req.body.sort_key || "creat_time";
    const pageNum = req.body.page_num || 1
    const pageSize = req.body.page_size || 12;
    const pageTotal = Math.floor(projectTotal / pageSize) + 1;
    const Page = {
      skip: (pageNum - 1) * pageSize,
      limit: pageSize,
      sort: { sortKey: -1 }
    }
    const op = {
      create_time: 1,
      _id: 1,
      project_name: 1,
      star_count: 1
    }

    projectHandlers.getDev(uid, op, Page)
      .then((result) => {
        res.json({
          status: 0,
          msg: '获取我开发的项目',
          page_num: pageNum,
          page_size: pageSize,
          page_total: pageTotal,
          projects_total: projectTotal,
          data: result
        })
      });
  });
  // 获取项目详情页
  app.get('/api/projects/:id', /* checkLogin, */ (req, res) => {
    const id = req.params.id;
    //const uid = "111";
    const op = {
      //uid: 1, // 上传的用户 id
      _id: 0,
      project_name: 1, // 项目名称
      description: 1, // 一句话描述
      detail: 1, // 简介
      imagePath: 1, // 项目图片 字符串数组
      project_link: 1, // 链接
      developer_count: 1, // 开发者人数
      //star_count: 1, // 点赞数
      //create_time: 1, // 创建时间
      //mod_time: 1 // 最后修改时间
    }
    projectHandlers.getDetail(id, op)
      .then((result) => {
        res.json({ status: 0, msg: "获取成功", data: result });
      })
      .catch(err => {
        if (err) {
          throw new Error(err);
          res.json({ status: 1, msg: err.message })
        }
      })
  });
  // 创建项目
  app.post('/api/projects', /* checkLogin, */ (req, res) => {
    const uid = 1123234; // 测试用
    const project_name = req.body.project_name; // 项目名称
    const description = req.body.description; // 项目概要
    const detail = req.body.detail; // 项目要求
    const imagePath = req.body.imagePath; // 项目图片
    const project_link = req.body.project_link; // 项目链接
    // 检验参数
    try {
      if (!project_name.length) {
        throw new Error('请填写项目名称');
      }
      if (!description.length) {
        throw new Error('请填写项目概要');
      }
      if (!detail.length) {
        throw new Error('请填写项目要求');
      }
      if (!imagePath.length) {
        throw new Error('请上传图片');
      }
      if (!project_link.length) {
        throw new Error('请填写项目链接');
      }
    } catch (e) {
      return res.json({ status: 1, msg: e.message });
    }

    const op = {
      uid: uid,
      project_name: project_name,
      description: description,
      detail: detail,
      imagePath: imagePath,
      project_link: project_link,
      create_time: (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString(),
      mod_time: (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString()
    };
    projectHandlers.createProject(op)
      .then((result) => {
        if (result) res.json({ status: 0, msg: '创建成功' });
      })
      .catch((err) => {
        throw new Error(err);
        res.json({ status: 1, msg: err.message });
      });
  });
  // 修改项目
  app.put('/api/projects/:id', /* checkLogin, */ (req, res) => {
    const project_name = req.body.project_name; // 项目名称
    const description = req.body.description; //项目概要
    const detail = req.body.detail; //项目要求
    const imagePath = req.body.imagePath; //项目图片
    const project_link = req.body.project_link; //项目链接
    // 检验参数
    try {
      if (!project_name.length) {
        throw new Error('请填写项目名称');
      }
      if (!description.length) {
        throw new Error('请填写项目概要');
      }
      if (!detail.length) {
        throw new Error('请填写项目要求');
      }
      if (!imagePath.length) {
        throw new Error('请上传图片')
      }
      if (!project_link.length) {
        throw new Error('请填写项目链接');
      }
    } catch (e) {
      console.log('error:', e.message);
      res.json({ status: 1, msg: e.message });
    }

    const id = req.params.id
    const data = {
      project_name: project_name,
      description: description,
      detail: detail,
      imagePath: imagePath,
      project_link: project_link,
      mod_time: (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString()
    }
    projectHandlers.verify(id)
      .then((result) => {
        if (result) {
          projectHandlers.updateProject(id, data)
            .then((result) => {
              if (result) {
                res.json({ status: 0, msg: '更新成功' });
              } else {
                res.json({ status: 1, msg: '更新失败' })
              }
            });
        }
      })
      .catch((err) => {
        res.json({ status: 1, msg: "该项目不存在" })
      })
  });
  // 参加项目
  app.post('/api/developers', (req, res) => {
      const uid = '111';
      const id = req.body.p_id;
      const dev_skills = req.body.dev_skills;
      const op = {
          uid: uid,
          pid: id,
          dev_skills: dev_skills,
          application_time: (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString()
        }
        //已加入检测未完成
      projectHandlers.acceptProject(op)
        .then(result => {
          res.json({ status: 0, msg: "已加入" });
        })
        .catch((err) => {
          res.json({ status: 1, msg: "该项目不存在" })
        })
    })
    // 点赞
  app.post('/api/projects/star', /* checkLogin, */ (req, res) => {
    const id = req.body.p_id;
    const uid = "111";
    projectHandlers.verify(id)
      .then((result) => {
        projectHandlers.getStar(id)
          .then((result) => {
            const starUsers = result.star_users;
            /*防止重复点赞功能未开发*/
            starUsers.push(uid);
            const star = result.star_count + 1;
            const op = {
              star_count: star,
              star_users: starUsers
            }
            projectHandlers.setStar(id, op)
              .then((result) => {
                if (result) res.json({ status: 0, msg: '已完成' });
              })
          })
      })
      .catch((err) => {
        if (err) throw new Error(err);
        res.json({ status: 1, msg: "该项目不存在" })
      })
  })
}
