const db = require('./db')
const inquirer = require('inquirer');

module.exports.add = async (title) => {
    const list = await db.read()
    list.push({title, done: false})
    await db.write(list)
}

module.exports.clear = async () => {
    await db.write([])
}

module.exports.showAll = async () => {
    const list = await db.read()
    list.forEach((item, index) => {
        console.log(`${item.done ? '[+]' : '[_]'}${index + 1}-${item.title}`)
    })
    inquirer
        .prompt({
            type: 'list',
            name: 'index',
            message: '请选择你想操作的任务',
            choices: [{name: '退出', value: '-1'}, ...list.map((item, index) => {
                return {name: `${item.done ? '[+]' : '[_]'}${index + 1}-${item.title}`, value: index.toString()}
            }), {name: '创建任务', value: '-2'}]
        })
        .then((answer) => {
            const index = parseInt(answer.index)
            if (index >= 0) {
                inquirer.prompt({
                    type: 'list', name: 'action',
                    message: '请选择操作',
                    choices: [
                        {name: '退出', value: 'quit'},
                        {name: '已完成', value: 'Done'},
                        {name: '未完成', value: 'Undone'},
                        {name: '删除', value: 'delete'}
                    ]
                }).then(ans2=>{
                    switch (ans2.action){
                        case 'Done' :
                            list[index].done=true
                            db.write(list)
                            break;
                        case 'Undone' :
                            list[index].done=false
                            db.write(list)
                            break;
                        case 'delete' :
                            list.splice(index,1)
                            db.write(list)
                            break;
                    }
                })
            } else if (index === -2) {
                inquirer.prompt({
                    type: 'input',    // type : input
                    name: 'title',
                    message: '请输入任务名字'
                }).then(answer=>{
                    list.push({
                        title:answer.title,
                        done:false
                    })
                    db.write(list)
                })
            }
        })
}