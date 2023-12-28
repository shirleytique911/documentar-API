import { Router } from "express";

import UserDTO from "../dao/DTOs/user.dto.js";
import { userService } from "../repositories/index.js";
import Users from "../dao/mongo/users.mongo.js"

const router = Router()

const usersMongo = new Users()

router.get("/", async (req, res) => {
    try
    {
        let result = await usersMongo.get()
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
        let { first_name, last_name, email, age, password, rol } = req.body
        let user = new UserDTO({ first_name, last_name, email, age, password, rol })
        let result = await userService.createUser(user)
        res.status(200).send({ status: "success", payload: result });
    }
    catch (error)
    {
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
    
})

export default router