import pino from "pino"
import __dirname from '../utils.js';
import services from "../dao/services.js";
import io from "../app.js";

const streams = [
    {level:'info',stream:process.stdout},
    {level:'warn',stream:pino.destination(__dirname + '/warn.log')},
    {level:'error',stream:pino.destination(__dirname+'/error.log')}
];

const logger = pino({},pino.multistream(streams))

const home = async(req,res)=>{
    try {
        if(!req.session.user){ 
            return res.redirect('/login')
        }
        
        let user = req.session.user
        let listCart = await services.cartsService.getCartProducts(req.session.user.cartID)
        let total = await services.cartsService.getTotal(user.cartID)
        let endShop = `    <form class="endshopForm"action="/" method="post">
        <button id="endshop" class="endshop" formaction="/api/carts/endshop">Finalizar compra</button>
        </form>`

        if(listCart.length ==0){
            endShop = '<p>No tienes productos agregados</p>'
            res.render("viewHome",{user,listCart,endShop,total})
            
        }else{ 
            res.render("viewHome",{user,listCart,endShop,total})}
        io.on('connection',async(socket)=>{
            let products = await services.productsService.getAll()
            let datos = JSON.parse(products)
            datos.push({cartID:user.cartID})
            io.emit('list',datos)
        
        })    
    } catch (error) {
        logger.error(`Error :  ${error}`)
    }
   
}

const register = (req,res)=>{
    logger.info(`Coneccion recibida en ' /register ' con metodo GET`)
    res.render('register');
};

const login = (req,res)=>{
    logger.info(`Coneccion recibida en ' /login ' con metodo GET`)
    res.render('login')
};

const current = async(req,res)=>{
    logger.info(`Coneccion recibida en ' /Home ' con metodo GET`)

    if(!req.session.user){
     res.render('error',{mensaje:"Credenciales Invalidas"})
    }else{
        res.redirect('/')
    }
}

const profile = async(req,res)=>{
    let user = req.session.user
    logger.info(`Coneccion recibida en ' /profile ' con metodo GET`)
    if(!req.session.user) res.redirect('/')
    else res.render('data',{user})
}

const logout = (req,res)=>{
    if(!req.session.user){ 
        return res.redirect('/login')
    }

    logger.info(`Coneccion recibida en ' /logout ' con metodo GET`)
    req.session.destroy()
    res.redirect('/')
}



export default{
    register,
    login,
    current,
    profile,
    logout,
    home,

}