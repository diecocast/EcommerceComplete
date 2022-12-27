const socket = io();
let productsForm = document.getElementById('productsForm')
const handleSubmit = (evt,form,route) =>{
    evt.preventDefault()
    let formData = new FormData(form);
    let obj = {};
    formData.forEach((value,key)=>obj[key]=value);
    fetch(route,{
        method:"POST",
        body:formData
    }).then(res =>res.json()).then(json=>console.log(json));
}

productsForm.addEventListener('submit',(e)=>handleSubmit(e,e.target,'/api/products'))

socket.on('list',data=>{
    let log = document.getElementById('list');
    let list = "";
    Array.from(data).forEach(product => {
        if(!product.id) return ''
        list = list+`
    <tr>
       <th scope="row">${product.id}</th>
       <td>${product.code} </td>
       <td>${product.name} </td>
       <td>${product.description} </td>
       <td>${product.price} </td>
       <td>${product.stock} </td>
       <td> <img src="img/${product.thumbnail}" alt="El enlace no esta disponible" width="60"></td>    
       <td><button type="submit" formaction="/api/carts/products/${product.id}"> +1 </button></td> 
    </tr>`
    });
    log.innerHTML = list;
    document.getElementById("productsForm").reset()
})

let deleteForm = document.getElementById('deleteForm')
const deleteSubmit = async(evt,form,route) =>{
    evt.preventDefault()
    let formData = new FormData(form);
    let obj = {};
    formData.forEach((value,key)=>obj[key]=value);
    fetch(route,{
        method:"DELETE",
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(res =>res.json())
    .then(json=>{
        console.log(json)
        window.location.href = "/"
    });

}

deleteForm.addEventListener('submit',(e)=>deleteSubmit(e,e.target,'/api/products'))


let updateForm = document.getElementById('updateForm')
const actualizarSubmit = (evt,form,route) =>{
    evt.preventDefault()
    let formData = new FormData(form);
    let obj = {};
    formData.forEach((value,key)=>obj[key]=value);
    fetch(route,{
        method:"PUT",
        body:formData,
    }).then(res =>res.json()).then(json=>console.log(json));
    updateForm.reset()
}

updateForm.addEventListener('submit',(e)=>actualizarSubmit(e,e.target,'/api/products'))


let addProduct = document.getElementById('addProduct')
const addProductSubmit = (evt,form,route) =>{
    evt.preventDefault()
    let formData = new FormData(form);
    let obj = {};
    formData.forEach((value,key)=>obj[key]=value);
    fetch(route,{
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(res =>res.json()).then(json=>console.log(json));
}

updateForm.addEventListener('submit',(e)=>addProductSubmit(e,e.target,'/api/carts/cid'))




