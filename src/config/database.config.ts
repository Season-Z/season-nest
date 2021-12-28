// 到时候改造成一个方法，从cross-env读取一些变量
export default {
  type:
    process.env.BUILD_ENV === 'develop'
      ? process.env.DB_TYPE
      : process.env.DB_TYPE_PROD,
  host:
    process.env.BUILD_ENV === 'develop'
      ? process.env.DB_HOST
      : process.env.DB_HOST_PROD,
  port: Number(process.env.DB_PORT),
  database:
    process.env.BUILD_ENV === 'develop'
      ? process.env.DB_DATABASE
      : process.env.DB_DATABASE_PROD,
  username:
    process.env.BUILD_ENV === 'develop'
      ? process.env.DB_USERNAME
      : process.env.DB_USERNAME_PROD,
  password:
    process.env.BUILD_ENV === 'develop'
      ? process.env.DB_PASSWORD
      : process.env.DB_PASSWORD_PROD,
  logging: process.env.BUILD_ENV === 'develop' ? true : false,
  synchronize: true, // 是否同步true表示会自动将src/entity里面定义的数据模块同步到数据库生成数据表(已经存在的表的时候再运行会报错)
};
