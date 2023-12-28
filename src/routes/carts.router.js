import { Router } from "express";
//import { Carts } from '../dao/factory.js'
import CartDTO from "../dao/DTOs/cart.dto.js";
import TicketDTO from "../dao/DTOs/ticket.dto.js";
import { ticketService, cartService } from "../repositories/index.js";
import Carts from "../dao/mongo/carts.mongo.js";

const router = Router()

const cartMongo = new Carts()

router.get("/", async (req, res) => {
    try
    {
        let result = await cartMongo.get()
        res.status(200).send({ status: "success", payload: result });
    }
    catch(error)
    {
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    } 
})

router.post("/", async (req, res) => {
    try
    {
        let { products } = req.body
        let cart = new CartDTO({ products })
        let result = await cartService.createCart(cart)
        res.status(200).send({ status: "success", payload: result });
    }
    catch(error)
    {
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
})
router.post("/:cid/purchase", async (req, res) => {
    try {
        let id_cart = req.params.cid;
        //Body para probar el middleware
        //ruta  http://localhost:8080/carts/6566bc4357f010e82f16b9a1/purchase
        //la prueba se realizó con un carrito vacio enviando los productos que se compraron
        // se crea el ticket respectivo y se resta el stock si se valida disponibilidada
        // {
        //     "productos": [
        //       {
        //         "description": "Producto 2",
        //         "image": "imagen1.jpg",
        //         "price": 200,
        //         "stock": 5,
        //         "category": "Electrónicos",
        //         "availability": "in_stock"
        //       },
        //       {
        //         "description": "algo2",
        //         "image": "imagen3.jpg",
        //         "price": 100,
        //         "stock": 5,
        //         "category": "Electrónicos",
        //         "availability": "in_stock"
        //       }
        //     ],
        //     "correo": "correo@example.com"
        //   }
        const productos = req.body.productos;
        const correo = req.body.correo;
        let cart = cartService.validateCart(id_cart)
        if (!cart) {
            //return { error: "No se encontró el carrito con el ID proporcionado" };
            res.status(401).send({ status: "error", message: "No se encontró el carrito con el ID proporcionado" });
        }
        let validaStock = cartService.validateStock({productos})

        if (validaStock) {
            let totalAmount = await cartService.getAmount({productos})
            const ticketFormat = new TicketDTO({amount:totalAmount, purchaser:correo});
            const result = await ticketService.createTicket(ticketFormat);
            res.status(200).send({ status: "success", payload: result });
        } else {
            console.error("No hay suficiente stock para realizar la compra");
            res.status(300).send({ status: "error", message: "No hay suficiente stock para realizar la compra" });
        }
    } catch (error) {
        console.error("Error al procesar la compra:", error);
        return res.status(500).json({ error: "Error interno al procesar la compra" });
    }
})

export default router