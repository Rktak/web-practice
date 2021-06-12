const app=require('express');
const bodyParser=require('body-parser');
const port=3002;
const HttpError=require('./utils/http-error');

app.request(bodyParser.json());

app.use('/api/v1/user',userRoutes);
app.use('/api/v2/admin',adminRoutes);

app.use((req,res,next)=>{
    const error=new HttpError('page not found',404);
    throw error;
});

app.use((error,req,res,next)=>{
    res.status(error.code);
    res.json({message:error.message || 'unknown error ocured',code:error.code});
});


// app.get('/about',(req,res)=>{
//     res.send(JSON.stringify({page:"login",message="This is about"}));
// });
// app.post('/login',(req,res)=>{
//     res.send({page:"Login",message:"please submit yout credential"});
// });

app.listen(port,()=>
{
    console.log(`App running on http://localhost:${port}`);
});