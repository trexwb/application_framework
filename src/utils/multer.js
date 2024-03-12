/*
 * @Author: trexwb
 * @Date: 2023-12-22 13:35:09
 * @LastEditors: trexwb
 * @LastEditTime: 2023-12-29 09:33:39
 * @FilePath: \applications\drive\src\utils\status.js
 * @Description: In User Settings Edit
 * 一花一世界，一叶一如来
 * Copyright (c) 2023 by 思考豆(杭州)科技有限公司, All Rights Reserved. 
 */
const alias = require('@utils/alias');
const multer = require('multer');

module.exports = {
    array: () => {
        const upload = multer({ dest: alias.resolve(`@root/tmp`), limits: { fileSize: 10 * 1024 * 1024 } });
        return upload.array();
    }
};
