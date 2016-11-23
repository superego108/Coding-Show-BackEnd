import ProjectModel from '../models/project_model';
import developerModel from '../models/developer_model';

export default {
  // 获取项目总数
  getCount: function getCount(query) {
    return ProjectModel.count(query)
      .exec((err) => {
        if (err) throw err;
      });
  },
  // 获取项目列表
  getList: function getList(query, op, Page) {
    return ProjectModel.find(query, op)
      .skip(Page.skip)
      .limit(Page.limit)
      .sort(Page.sort)
      .exec((err) => {
        if (err) throw err;
      });
  },
  // 获取我的开发项目列表（待并到getList方法）
  getDev: function getDev(uid,op,Page) {
    return ProjectModel.find({},op)
      .where("developers.uid")
      .equals(uid)
      .skip(Page.skip)
      .limit(Page.limit)
      .sort(Page.sort)
      .exec((err) => {
        if (err) throw err;
      });
  },
  //得到详细信息
  getDetail: function getDetail(id, op) {
    return ProjectModel.find({ _id: id }, op)
      .exec((err) => {
        if (err) throw err;
      });
  },
  //创建项目
  createProject: function createProject(op) {
    return ProjectModel.create(op, (err) => {
      if (err) throw err;
    });
  },
  //修改项目
  updateProject: function updateProject(id, data) {
    return ProjectModel.findOneAndUpdate({ _id: id }, { $set: data })
      .exec((err) => {
        if (err) throw err;
      });
  },
  //加入项目
  acceptProject: function acceptProject(op) {
    return developerModel.create(op, (err) => {
      if (err) throw err;
    });
  },
  //点赞get
  getStar: function getStar(id) {
    return ProjectModel.findOne({ _id: id }, { star_count: 1, star_users: 1 })
      .exec((err) => {
        if (err) throw err;
      });
  },
  //点赞set
  setStar: function setStar(id, op) {
    return ProjectModel.findOneAndUpdate({ _id: id }, { $set: op })
      .exec((err) => {
        if (err) throw err;
      })
  },
  //确认项目存在
  verify: function verify(id) {
    return ProjectModel.findOne({ _id: id })
      .exec((err) => {
        if (err) throw err;
      })
  }
}
