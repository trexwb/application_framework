/*** 
 * @Author: trexwb
 * @Date: 2024-02-01 17:20:00
 * @LastEditors: trexwb
 * @LastEditTime: 2024-03-08 18:42:55
 * @FilePath: /laboratory/application/drive/src/app/controller/drive/secret.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
const utils = require('@utils/index');

const secretsHelper = require('@helper/secrets');
const accountsHelper = require('@helper/accounts');

const getList = async (req, res, next) => {
  try {
    // req.currentAccount 当登录的账号
    let sort = null;
    const regex = /^([+-])(.*?)$/si;
    const match = (req.body.sort || '').match(regex);
    if (match) {
      sort = [{ column: match[2], order: match[1] === '-' ? 'DESC' : 'ASC' }];
    }
    const where = req.body.filter || {};
    const page = req.body.page || 1;
    const pageSize = req.body.pageSize || 10;
    return await secretsHelper.getList(where, sort, page, pageSize);
  } catch (err) {
    req.code = 500002001;
    return;
  }
}

const getRow = async (req, res, next) => {
  try {
    // req.currentAccount 当登录的账号
    const { id } = req.body;
    if (!id) {
      req.code = 400002001;
      return;
    }
    const secretRow = await secretsHelper.getId(id || 0);
    if (!secretRow?.id) {
      req.code = 404002003;
      return;
    }
    delete secretRow.app_secret;
    return secretRow;
  } catch (err) {
    req.code = 500002002;
    return;
  }
}

const save = async (req, res, next) => {
  try {
    let data = {};
    if (req.body.id) {
      const secretRow = await secretsHelper.getId(req.body.id);
      if (!secretRow?.id) {
        req.code = 400002002;
        return;
      }
      data.id = secretRow.id;
    } else {
      data.app_id = utils.unique(16).toString();
      data.app_secret = utils.generateRandomString(64);
    }
    if (req.body.title) {
      data.title = req.body.title;
    }
    if (req.body.permissions) {
      data.permissions = req.body.permissions;
    }
    if (req.body.extension) {
      data.extension = req.body.extension;
    }
    return await secretsHelper.save(data);
  } catch (err) {
    req.code = 500002003;
    return;
  }
}

const update = async (req, res, next) => {
  try {
    const { id, code } = req.body;
    if (!id || !code) {
      req.code = 400002003;
      return;
    }
    const accountRow = await verifyCode(code, req.currentAccount);
    if (!accountRow) {
      req.code = 403002001;
      return;
    }
    const secretRow = await secretsHelper.getId(id);
    if (!secretRow?.id) {
      req.code = 400002004;
      return;
    }
    return await secretsHelper.save({
      id: secretRow.id,
      app_secret: utils.generateRandomString(64)
    });
  } catch (err) {
    req.code = 500002004;
    return;
  }
}

const enable = async (req, res, next) => {
  try {
    const { id } = req.body
    if (!id) {
      req.code = 400002005;
      return;
    }
    return await secretsHelper.save({
      id: id || 0,
      status: 1
    });
  } catch (err) {
    req.code = 500002005;
    return;
  }
}

const disable = async (req, res, next) => {
  try {
    const { id, code } = req.body;
    if (!id || !code) {
      req.code = 400002006;
      return;
    }
    // 需要认证码进行认证
    const accountRow = await verifyCode(code, req.currentAccount);
    if (!accountRow) {
      req.code = 403002002;
      return;
    }
    return await secretsHelper.save({
      id: id || 0,
      status: 0
    });
  } catch (err) {
    req.code = 500002006;
    return;
  }
}

const softDelete = async (req, res, next) => {
  try {
    const { id, code } = req.body;
    if (!id || !code) {
      req.code = 400002007;
      return;
    }
    // 需要认证码进行认证
    const accountRow = await verifyCode(code, req.currentAccount);
    if (!accountRow) {
      req.code = 403002003;
      return;
    }
    return await secretsHelper.delete({
      id: id || 0
    });
  } catch (err) {
    req.code = 500002007;
    return;
  }
}

const verifyCode = async (code, currentAccount) => {
  try {
    const accountRow = await accountsHelper.verifyCode(code);
    if (!accountRow?.id) {
      return false;
    }
    if (currentAccount?.id !== accountRow?.id) {
      return false;
    }
    return accountRow;
  } catch (err) {
    return false;
  }
}

module.exports = {
  getList,
  getRow,
  save,
  update,
  enable,
  disable,
  softDelete
}