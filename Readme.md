<h2> 高优先级！</h2>

1. 数据库运行压缩算法，提供能画图的数据
    - 压缩
    - query 执行（运行多次，求均值和方差，画图）

2. 修改 script.js 文件画图/表数据，展示结果

<h2> 关键功能 </h2>

1. 读取、执行 Query
    - 需要根据 query type 来区分前端页面的展示内容。（目前的区分方式：在 `script.js` 中用正则表达式识别的 sql 开头，非常不严谨..）
    - 创建数据表应能显示在 side bar 中。

2. 数据载入

3. 结果展示

4. 展示数据表，对于 out-of-line 的数据，用 ref link 链接到新的 webpage 展示文本。模仿数据库的 out-of-line reference。

<h2> 不关键的功能 </h2>

1. 展示所有数据库

    `index.html`: side-medu

2. 选择数据库后，展示所有数据表

3. 数据加载/保存

<h2> 前端的现存问题 -- 后期修改（GJW） </h2>

1. 现在系统是每次点击按钮时生成对应结果的。为了避免重复运行，逻辑上可能需要记录一个 Txn ID，或者缓存当前 Txn ID 的执行结果，用于系统展示。

2. 页面缩放问题

3. Bar with error 图，error 部分出现太早，添加动画

4. Query editor 后期改成 CodeMirror 版本，可以高亮。目前版本行号计数有点问题。

5. 页面切换/刷新时忽闪问题。