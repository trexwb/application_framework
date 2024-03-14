/*** 
 * @Author: trexwb
 * @Date: 2024-02-01 17:20:00
 * @LastEditors: trexwb
 * @LastEditTime: 2024-03-13 16:35:27
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
  } catch (error) {
    return req.handleError(500002001, error);
  }
}

const getRow = async (req, res, next) => {
  try {
    // req.currentAccount 当登录的账号
    const { id } = req.body;
    if (!id) {
      return req.handleError(400002001);
    }
    const secretRow = await secretsHelper.getId(id || 0);
    if (!secretRow?.id) {
      return req.handleError(404002003);
    }
    delete secretRow.app_secret;
    return secretRow;
  } catch (error) {
    return req.handleError(500002002, error);
  }
}

const save = async (req, res, next) => {
  try {
    let data = {};
    if (req.body.id) {
      const secretRow = await secretsHelper.getId(req.body.id);
      if (!secretRow?.id) {
        return req.handleError(400002002);
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
  } catch (error) {
    return req.handleError(500002003, error);
  }
}

const update = async (req, res, next) => {
  try {
    const { id, code } = req.body;
    if (!id || !code) {
      return req.handleError(400002003);
    }
    const accountRow = await verifyCode(code, req.currentAccount);
    if (!accountRow) {
      return req.handleError(403002001);
    }
    const secretRow = await secretsHelper.getId(id);
    if (!secretRow?.id) {
      return req.handleError(400002004);
    }
    return await secretsHelper.save({
      id: secretRow.id,
      app_secret: utils.generateRandomString(64)
    });
  } catch (error) {
    return req.handleError(500002004, error);
  }
}

const enable = async (req, res, next) => {
  try {
    const { id } = req.body
    if (!id) {
      return req.handleError(400002005);
    }
    return await secretsHelper.save({
      id: id || 0,
      status: 1
    });
  } catch (error) {
    return req.handleError(500002005, error);
  }
}

const disable = async (req, res, next) => {
  try {
    const { id, code } = req.body;
    if (!id || !code) {
      return req.handleError(400002006);
    }
    // 需要认证码进行认证
    const accountRow = await verifyCode(code, req.currentAccount);
    if (!accountRow) {
      return req.handleError(403002002);
    }
    return await secretsHelper.save({
      id: id || 0,
      status: 0
    });
  } catch (error) {
    return req.handleError(500002006, error);
  }
}

const softDelete = async (req, res, next) => {
  try {
    const { id, code } = req.body;
    if (!id || !code) {
      return req.handleError(400002007);
    }
    // 需要认证码进行认证
    const accountRow = await verifyCode(code, req.currentAccount);
    if (!accountRow) {
      return req.handleError(403002003);
    }
    return await secretsHelper.delete({
      id: id || 0
    });
  } catch (error) {
    return req.handleError(500002007, error);
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
  } catch (error) {
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