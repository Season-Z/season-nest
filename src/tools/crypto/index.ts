import crypto from 'crypto';
import random from './random';
import base64 from './base64';

class SimpNodeAuth {
  /**
   * @param {password} 明文密码
   * @return:
   * @Description: 生成密文的方法

   */
  public makePassword(password: string): string {
    // 1.生成随机数
    const randomStr = random();
    // 2.对生成的随机数base64加密
    const base64RandomStr = base64.encode(randomStr);
    return this.md5MakePassword(base64RandomStr, password);
  }

  /**
   * @param {password}: string 没有加密的密码
   * @param {sqlPwd}: string 已经加密的密码
   * @return:
   * @Description: 判断与密文密码是否匹配
  
   */
  public checkPassword(password: string, sqlPwd: string) {
    // 1.从查询出来的密码中截取前面随机数
    const base64RandomStr = sqlPwd.substring(0, 16);
    const lastPwd = this.md5MakePassword(base64RandomStr, password);
    return Object.is(sqlPwd, lastPwd);
  }

  private md5MakePassword(base64RandomStr: string, password: string): string {
    // 2.将密码与加密的随机数拼接
    const newPwd = base64RandomStr + password;
    // 3.将第二步进行md5加密
    const md5 = crypto.createHash('md5');
    const md5Pwd = md5.update(newPwd).digest('hex');
    // 4.将加密后的md5Pwd继续加密
    const base64Md5 = base64.encode(md5Pwd);
    // 5.继续将2和4拼接
    const lastPwd = base64RandomStr + base64Md5;
    return lastPwd;
  }
}

export default SimpNodeAuth;
export { SimpNodeAuth };
