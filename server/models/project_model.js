import mongoose, { Schema } from 'mongoose';

export default mongoose.model('project', new Schema({
  uid: String, // 上传的用户 id
  project_name: String, // 项目名称
  description: String, // 一句话描述
  detail: String, // 简介
  imagePath: Array, // 项目图片 字符串数组
  project_link: String, // 链接
  developers: { type: Array, default: [] }, // 开发者
  developer_count: { type: Number, default: 0 }, // 开发者人数
  star_count: { type: Number, default: 0 }, // 点赞数
  star_users: { type: Array, default: [] }, // 点赞用户 存储用户id
  status: { type: Number, default: 0 }, // 可用/禁用
  create_time: String, // 创建时间
  mod_time: String // 最后修改时间
}));
