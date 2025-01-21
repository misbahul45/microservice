import cors from 'cors'
export default function  setUpCors(){
    return cors({
        origin:'*',
        methods:['GET','POST','PATCH','DELETE'],
        credentials:true
    })
}