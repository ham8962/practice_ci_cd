const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql')
const path = require('path')
const bodyParser = require('body-parser')
const _dirname = path.resolve();
const ejs = require('ejs')
const { CONNREFUSED } = require('dns')

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    database: 'express_db'
});




//app.get('/', (req,res) => res.send('HELLO WORLD!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.set('views', './') //어느 파일에서 열건지 꼭 지정해주자 ./의 의미는 작업중인 현재 폴더이다 (Error: Failed to lookup view "index_list.ejs" in views directory "C:\Users\dydwls\Desktop\AI스쿨\server\views" 방지)
app.set('view engine', 'ejs'); //이 코드 한 줄이 ejs파일을 보여주게 한다


con.connect(function(err){
    if (err) throw err;
    console.log('Connected');
    //const sql = 'CREATE TABLE users(id INT NULL PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, email Varchar(255) NOT NULL)';
    
});

const sql_insert = "INSERT INTO users(name,email) VALUES('kevin', 'kevin@test.com') "
con.query(sql_insert, function(err,result,fields)
{
    if(err) throw err;
    console.log('table created');
    console.log(result); //insert 문에서는 OKpacket이 반환됨 
    
});

/*app.get('/', (request,response) => 
{
    //const sql_select = "select * from users" //select문 (read) 구현
    //const sql_insert1 = "INSERT INTO users(name,email) VALUES('kevin', 'kevin@test.com') "
    //const sql_insert2 = "INSERT INTO users(name,email) VALUES(?,?)" // insert문 입력 방식 중 ?를 이용하는 방식
    //const sql_insert3 = "INSERT INTO users(name,email) SET ? " // SET을 사용하는 방식 
    /*con.query(sql_insert1, function(err,result,fields)
    {
        if(err) throw err;
        console.log('table created');
        console.log(result); //insert 문에서는 OKpacket이 반환됨 
        response.send(result);
    });*/
    /*con.query(sql_insert2,['Jack', 'Jack1998@naver.com'],function(err,result,fields) // insert문 입력 방식 중 ?를 이용하는 방식
    {
        if(err) throw err;
        console.log('table created');
        console.log(result); //insert 문에서는 OKpacket이 반환됨 
        response.send(result);
    });
    con.query(sql_insert3,{name:'Tom', email:'Tom@gmail.com'},function(err,result,fields) // insert문 입력 방식 중 SET을 이용하는 방식
    {
        if(err) throw err;
        console.log('table created');
        console.log(result); //insert 문에서는 OKpacket이 반환됨 
        response.send(result);
    });

    
});*/ 

//클라이언트가 웹에서 입력한 데이터를 DB에 추가해보자!(index.html사용 )

app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/create', (req,res) => 
{
    res.sendFile(path.join(_dirname, 'index.html')) //(join(_dirname은 현재 작업중인 디렉토리 위치 까지 알려줌 ,그 뒤가 내가 열고싶은 파일 join이 두개를 합쳐준다 ))
});

/*app.post('/', (req,res) => 
{   
    /*console.log(req);
    const body = req.body;
    console.log(body);
    res.send(body);
    const sql = "INSERT INTO users SET ?"
    
    con.query(sql,req.body, function(err, result, fields)
    {
        if(err) throw err;
        console.log(result);
        res.send('등록이 완료 되었습니다.')
    });
});*/


app.get('/', (req,res) => 
{
    const sql = "select * from users";
    con.query(sql, function(err,result,fields)
    {
        if(err) throw err;
        res.render('index_list', {users : result}); //users라는 변수안에 result를 저장한다 동적 웹페이가 필요하여 ejs사용
    });
})

app.post('/',(req,res) =>
{
    const sql = "INSERT INTO users SET ? ";
    con.query(sql,req.body,function(err,result,fields)
    {
        if(err) throw err;
        console.log(result);
        res.redirect('/');
    });
})

app.get('/delete/:id', (req,res)=>
{
    const sql = "DELETE FROM users WHERE id = ?";
    con.query(sql,[req.params.id],function(err,result,fields)
    {
        if(err) throw err;
        console.log(result);
        res.redirect('/'); //redirect 되면서 데이터가 삭제된 이후 테이블을 select로 긁어와서 보여준다
    })
});

app.get('/edit/:id', (req,res) => 
{
    const sql = "SELECT * FROM users WHERE id = ?";
    con.query(sql,[req.params.id],function(err,result,fields)
    {
        if(err) throw err;
        console.log(result);
        res.render('edit', {user : result}); //users라는 변수안에 result를 저장한다 동적 웹페이지가 필요하여 ejs사용
        // console.log(user);  ReferenceError: user is not defined 왜 error뜨지...
    });
})

app.post('/update/:id', (req,res) =>
{
    const sql = "UPDATE users SET ? WHERE id = " + req.params.id; // sql공부 필요
    con.query(sql,req.body,function(err,result,fields)
    {
        if(err) throw err;
        console.log(result);
        res.redirect('/');
    });
})

