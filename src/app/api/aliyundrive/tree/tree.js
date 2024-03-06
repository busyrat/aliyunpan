const fs = require('fs');

function buildTree(files) {
    const fileMap = new Map();
    const root = { file_id: 'root', children: [] };

    // 构建文件映射表
    for (const file of files) {
        file.children = [];
        fileMap.set(file.file_id, file);
    }

    // 将文件添加到父文件夹中
    for (const file of files) {
        const parentFile = fileMap.get(file.parent_file_id);
        if (parentFile) {
            parentFile.children.push(file);
        } else {
            root.children.push(file); // 没有父文件夹则为根文件夹的子文件
        }
    }

    return root;
}

// 读取 JSON 文件
fs.readFile('aliyun.json5', 'utf8', (err, data) => {
    if (err) {
        console.error('读取文件时出错:', err);
        return;
    }

    try {
        const files = JSON.parse(data);
        const tree = buildTree(files);
        // 将树形结构写入文件
        fs.writeFile('tree.json', JSON.stringify(tree, null, 4), 'utf8', (err) => {
          if (err) {
              console.error('写入文件时出错:', err);
              return;
          }
          console.log('树形结构已成功写入到文件 tree.json');
      });
    } catch (error) {
        console.error('解析 JSON 时出错:', error);
    }
});