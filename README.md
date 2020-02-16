# Mder

The full-featured markdown parser, converts Markdown text into JSON objects, which can be used to produce HTML, PDF and other content.

---
### Usage
```shell
$ npm i mder --save
```

```javascript
const Mder = require('mder');
const mder = new Mder();
    mder.parse(`
# h1
[ ] tesk not complete
[x] tesk complete
`);
const result = mder.getResult();
```

### Feature Supported

- [x] 一级标题 ~ 六级标题
- [x] 有序列表
- [x] 无序列表
- [x] 引用内容
- [x] 代码段
- [x] 分割线
- [x] 任务列表
- [x] 加粗
- [x] 斜体
- [x] 图片
- [x] 超链接

### Data after this readme parsed
```JSON
[
  {
    "type": "head",
    "level": 1,
    "value": "Mder",
    "childs": [
      {
        "type": "line",
        "childs": [
          {
            "type": "text",
            "value": "The full-featured markdown parser, converts Markdown text into JSON objects, which can be used to produce HTML, PDF and other content."
          }
        ]
      },
      {
        "type": "empty"
      },
      {
        "type": "hr"
      },
      {
        "type": "head",
        "level": 3,
        "value": "Usage",
        "childs": [
          {
            "type": "code",
            "lang": "shell",
            "childs": [
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "$ npm i mder --save"
                  }
                ]
              }
            ]
          },
          {
            "type": "empty"
          },
          {
            "type": "code",
            "lang": "javascript",
            "childs": [
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "const Mder = require('mder');"
                  }
                ]
              },
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "const mder = new Mder();"
                  }
                ]
              },
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "    mder.parse(`"
                  }
                ]
              },
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "# h1"
                  }
                ]
              },
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "[ ] tesk not complete"
                  }
                ]
              },
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "[x] tesk complete"
                  }
                ]
              },
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "`);"
                  }
                ]
              },
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "const result = mder.getResult();"
                  }
                ]
              }
            ]
          },
          {
            "type": "empty"
          }
        ]
      },
      {
        "type": "head",
        "level": 3,
        "value": "Feature Supported",
        "childs": [
          {
            "type": "task",
            "level": 0,
            "childs": [
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "一级标题 ~ 六级标题"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "有序列表"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "无序列表"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "引用内容"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "代码段"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "分割线"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "任务列表"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "加粗"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "斜体"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "图片"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "超链接"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "empty"
          }
        ]
      },
      {
        "type": "head",
        "level": 3,
        "value": "Data after this readme parsed",
        "childs": [
          {
            "type": "code",
            "lang": "JSON",
            "childs": []
          },
          {
            "type": "empty"
          }
        ]
      },
      {
        "type": "head",
        "level": 3,
        "value": "License",
        "childs": [
          {
            "type": "line",
            "childs": [
              {
                "type": "text",
                "value": "MIT"
              }
            ]
          },
          {
            "type": "empty"
          }
        ]
      }
    ]
  }
]
```

### License
MIT