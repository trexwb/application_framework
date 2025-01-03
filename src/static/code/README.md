城市
---

[2022年最新中华人民共和国县以上行政区划代码.json](https://github.com/small-dream/China_Province_City/blob/master/2022%E5%B9%B4%E6%9C%80%E6%96%B0%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD%E5%8E%BF%E4%BB%A5%E4%B8%8A%E8%A1%8C%E6%94%BF%E5%8C%BA%E5%88%92%E4%BB%A3%E7%A0%81.json)

[Github源码](https://github.com/small-dream/China_Province_City)


其他方式
---

const { data, province, city, area, town } = require('province-city-china/data');
- data - 总数据(省/地/县/乡)
- province - 省级(省/直辖市/特别行政区)
- city - 地级(城市)
- area - 县级(区县)
- town - 乡级(乡镇/街)

[Github源码](https://github.com/uiwjs/province-city-china)


国家
---

国家名字多语言json文件

最近我有一个项目需要多语言的国家选择列表（中文，英语，法语，意大利语，西班牙语，日本语，俄语，德语），我在网上没有找到一个好的数据。所以我自己用java脚本搞了一个，如果有人也需要同样的数据，可以下载这个json文件，省下点时间干其他的事情吧。。😄

Lately, I have a project with a country select list in multi-language(chinese,english,french,italian,spanish,japanese,russian,germen),but I can't find a good api or json data from Internet.So I create one for myself using java script,If anyone face the same problem like me, You can take this json file and save your time.Haha...

[Github源码](https://github.com/zhaoweih/countries_json)


# 辅助代码
## 查询城市数据
> 按相同结构返回每一级数据

如搜索“110105”，获得的结果为：
```js
{
  "code": "110000",
  "name": "北京市",
  "children": {
      "code": "110000",
      "name": "北京市",
      "children": {
          "code": "110105",
          "name": "朝阳区"
      }
  }
}
```
方法为：
```js
const cityData = require('./city.json');
// 查找指定code对应的区域信息及其所有父级信息
function findCityDataByCode(data, targetCode) {
    function findRegionRecursive(currentData) {
        for (const region of currentData) {
            if (region.code === targetCode) {
                return {
                    code: region.code,
                    name: region.name
                };
            }
            const foundInChildren = findRegionRecursive(region.children || []);
            if (foundInChildren) {
                return {
                    code: region.code,
                    name: region.name,
                    children: foundInChildren
                };
            }
        }
        return null;
    }

    return findRegionRecursive(data);
}
// 使用示例
const targetCode = '110101';
const result = findCityDataByCode(cityData, targetCode);

console.log(result);
```

## 取反

如搜索“110105”，获得的结果为：
```js
{
    "code": "110105",
    "name": "朝阳区",
    "parent": {
        "code": "110100",
        "name": "北京市",
        "parent": {
            "code": "110000",
            "name": "北京市"
        }
    }
}
```
方法为：
```js
const cityData = require('./city.json');
function findRegionByCodeAndBuildReverse(data, targetCode) {
    let currentRegion = null;
    function findRegionRecursive(currentData) {
        for (const region of currentData) {
            if (region.code === targetCode) {
                currentRegion = region;
                break;
            }
            const foundInChildren = findRegionRecursive(region.children || []);
            if (foundInChildren) {
                return region;
            }
        }
        return null;
    }
    findRegionRecursive(data);

    if (!currentRegion) {
        return null;
    }

    let result = {
        code: currentRegion.code,
        name: currentRegion.name
    };
    let parent = currentRegion.parent || null;
    while (parent) {
        result = {
            code: parent.code,
            name: parent.name,
            parent: result
        };
        parent = parent.parent || null;
    }

    return result;
}
const targetCode = '110105';
const result = findRegionByCodeAndBuildReverse(cityData, targetCode);
console.log(result);
```