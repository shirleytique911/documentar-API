import { Router } from "express";
import ProductDTO from "../dao/DTOs/product.dto.js";
import { productService } from "../repositories/index.js";
import Products from "../dao/mongo/products.mongo.js"

const router = Router()

const productMongo = new Products()

router.get("/", async (req, res) => {
    try
    {
        let result = await productMongo.get()
        res.status(200).send({ status: "success", payload: result });
    } 
    catch (error) 
    {
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
    
})

router.post("/", async (req, res) => {
    try
    {
        let { description, image, price, stock, category, availability, owner } = req.body
        let prod = new ProductDTO({ description, image, price, stock, category, availability, owner })
        let result = await productService.createProduct(prod)
        res.status(200).send({ status: "success", payload: result });
    }
    catch (error)
    {
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
    
})

export default router